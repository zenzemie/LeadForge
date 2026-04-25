const { generateOutreach } = require('../services/openaiService');
const supabase = require('../config/supabase');

const generateMessage = async (req, res) => {
  const { leadId, tone } = req.body;

  if (!leadId || !tone) {
    return res.status(400).json({ error: 'leadId and tone are required' });
  }

  try {
    // Fetch lead details from Supabase
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Generate message using OpenAI
    const message = await generateOutreach(lead, tone);

    res.status(200).json({
      leadId,
      tone,
      subject: message.subject,
      body: message.body,
    });
  } catch (error) {
    console.error('Error in generateMessage controller:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateMessage,
};
