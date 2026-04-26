const supabase = require('../config/supabase');
const { searchBusinesses, findEmailFromWebsite, calculateScore } = require('../services/discoveryService');

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
    const businesses = await searchBusinesses(category, location);
    
    const discoveredLeads = [];

    for (const business of businesses) {
      // Yelp provides the website URL as 'url' (Yelp page) 
      // but often includes the business's own website if available
      // Note: Yelp Fusion API 'url' is the Yelp listing. 
      // We often need to look for the actual business website.
      // In some versions of Yelp API, the business website is a separate field.
      // If not, we use the Yelp URL as a fallback for the crawler to at least try.
      
      let email = null;
      let website = null;
      
      // Attempt to find actual website if Yelp provides it (Business details might be needed)
      // For now, let's assume we use the provided data.
      
      // Yelp's search result 'url' is the Yelp listing.
      // We will try to find the email if they have a dedicated website.
      // To get the actual business website, we sometimes need the Business Details endpoint.
      // Let's just use what we have from search for now to keep it fast.
      
      const score = calculateScore(business);

      // Check for duplicates
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('id')
        .or(`name.eq."${business.name}", phone.eq."${business.display_phone}"`)
        .limit(1);

      if (existingLeads && existingLeads.length > 0) {
        continue;
      }

      const leadData = {
        name: business.name,
        website: business.url, // Falling back to Yelp URL
        phone: business.display_phone || null,
        industry: category,
        email: null, // Email requires deeper crawling or business details
        score: score,
        status: 'not_contacted',
        notes: `Discovered via Yelp. Rating: ${business.rating}, Reviews: ${business.review_count}`
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();

      if (!error && data) {
        discoveredLeads.push(data[0]);
      }
    }

    res.status(200).json({
      message: `Discovery complete. Found and processed ${discoveredLeads.length} leads via Yelp.`,
      leads: discoveredLeads
    });

  } catch (error) {
    console.error('Error in discoverLeads (Yelp):', error);
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
