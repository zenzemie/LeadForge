const supabase = require('../config/supabase');
const { searchPlaces, getPlaceDetails, findEmailFromWebsite, calculateScore } = require('../services/discoveryService');

const getAllLeads = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Lead not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update(req.body)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const discoverLeads = async (req, res) => {
  const { category, location } = req.body;

  if (!category || !location) {
    return res.status(400).json({ error: 'Category and location are required' });
  }

  try {
    const query = `${category} in ${location}`;
    const places = await searchPlaces(query);
    
    const discoveredLeads = [];

    // Process top 5 places to avoid long timeouts and high cost during initial phase
    for (const place of places.slice(0, 5)) {
      const details = await getPlaceDetails(place.place_id);
      
      let email = null;
      if (details.website) {
        email = await findEmailFromWebsite(details.website);
      }

      const score = calculateScore(details) + (email ? 15 : 0);

      const leadData = {
        name: details.name,
        website: details.website || null,
        phone: details.formatted_phone_number || null,
        industry: category,
        email: email,
        score: score,
        status: 'not_contacted',
        notes: `Discovered via Google Places. Rating: ${details.rating || 'N/A'}`
      };

      // Upsert into Supabase (by name for now, though not ideal)
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();

      if (!error && data) {
        discoveredLeads.push(data[0]);
      }
    }

    res.status(200).json({
      message: `Discovery complete. Found and processed ${discoveredLeads.length} leads.`,
      leads: discoveredLeads
    });

  } catch (error) {
    console.error('Error in discoverLeads:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  discoverLeads,
};
