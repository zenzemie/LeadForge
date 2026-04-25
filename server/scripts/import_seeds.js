const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('dummy')) {
  console.error('Error: Please configure real SUPABASE_URL and SUPABASE_ANON_KEY in .env before importing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const leads = [
  // Restaurants
  { name: 'Dishoom (King\'s Cross)', website: 'https://www.dishoom.com', industry: 'Restaurant', location: 'London, UK' },
  { name: 'The Ledbury', website: 'https://www.theledbury.com', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Sketch', website: 'https://sketch.london', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Dinner by Heston', website: 'https://www.dinnerbyheston.com', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Gymkhana', website: 'https://gymkhanalondon.com', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Hawksmoor Seven Dials', website: 'https://thehawksmoor.com', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Padella', website: 'https://www.padella.co', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Gloria', website: 'https://www.bigmammagroup.com', industry: 'Restaurant', location: 'London, UK' },
  { name: 'Rules', website: 'https://rules.co.uk', industry: 'Restaurant', location: 'London, UK' },
  { name: 'The Wolseley', website: 'https://www.thewolseley.com', industry: 'Restaurant', location: 'London, UK' },
  // Salons
  { name: 'Taylor Taylor London', website: 'https://taylortaylorlondon.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Bleach London', website: 'https://www.bleachlondon.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Windle London', website: 'https://www.windlelondon.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Josh Wood Colour', website: 'https://joshwoodcolour.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Hershesons', website: 'https://www.hershesons.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Blue Tit London', website: 'https://www.bluetitlondon.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Hari\'s Salon', website: 'https://www.harissalon.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Larry King Salon', website: 'https://www.larryking.co.uk', industry: 'Salon', location: 'London, UK' },
  { name: 'George Northwood', website: 'https://georgenorthwood.com', industry: 'Salon', location: 'London, UK' },
  { name: 'Glasshouse Salon', website: 'https://www.glasshousesalon.co.uk', industry: 'Salon', location: 'London, UK' },
  // Clinics
  { name: 'The Harley Street Clinic', website: 'https://www.hcahealthcare.co.uk', industry: 'Clinic', location: 'London, UK' },
  { name: 'London Medical', website: 'https://londonmedical.co.uk', industry: 'Clinic', location: 'London, UK' },
  { name: 'The London Clinic', website: 'https://www.thelondonclinic.co.uk', industry: 'Clinic', location: 'London, UK' },
  { name: 'Cadogan Clinic', website: 'https://www.cadoganclinic.com', industry: 'Clinic', location: 'London, UK' },
  { name: 'Private Harley Street Clinic', website: 'https://privateharleystreetclinic.com', industry: 'Clinic', location: 'London, UK' },
  { name: 'Cleveland Clinic London', website: 'https://clevelandcliniclondon.uk', industry: 'Clinic', location: 'London, UK' },
  { name: '10 Harley Street', website: 'https://www.10harleystreet.co.uk', industry: 'Clinic', location: 'London, UK' },
  { name: 'Marylebone Health', website: 'https://marylebonehealth.com', industry: 'Clinic', location: 'London, UK' },
  { name: 'TDL Pathology', website: 'https://www.tdlpathology.com', industry: 'Clinic', location: 'London, UK' },
  { name: 'London Doctors Clinic', website: 'https://www.londondoctorsclinic.co.uk', industry: 'Clinic', location: 'London, UK' },
];

async function importLeads() {
  console.log(`Importing ${leads.length} leads...`);
  
  const { data, error } = await supabase
    .from('leads')
    .upsert(leads.map(l => ({ ...l, status: 'not_contacted', qualification_score: 50 })))
    .select();

  if (error) {
    console.error('Error importing leads:', error);
  } else {
    console.log(`Successfully imported ${data.length} leads!`);
  }
}

importLeads();
