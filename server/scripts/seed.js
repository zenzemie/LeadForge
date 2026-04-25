require('dotenv').config();
const supabase = require('../src/config/supabase');

const leads = [
  { name: 'Dishoom (King\'s Cross)', website: 'https://www.dishoom.com', industry: 'Restaurant', status: 'not_contacted', qualification_score: 85 },
  { name: 'The Ledbury', website: 'https://www.theledbury.com', industry: 'Restaurant', status: 'not_contacted', qualification_score: 90 },
  { name: 'Sketch', website: 'https://sketch.london', industry: 'Restaurant', status: 'not_contacted', qualification_score: 95 },
  { name: 'Taylor Taylor London', website: 'https://taylortaylorlondon.com', industry: 'Salon', status: 'not_contacted', qualification_score: 80 },
  { name: 'Bleach London', website: 'https://www.bleachlondon.com', industry: 'Salon', status: 'not_contacted', qualification_score: 85 },
  { name: 'The Harley Street Clinic', website: 'https://www.hcahealthcare.co.uk', industry: 'Clinic', status: 'not_contacted', qualification_score: 90 },
  { name: 'London Medical', website: 'https://londonmedical.co.uk', industry: 'Clinic', status: 'not_contacted', qualification_score: 88 }
];

async function seed() {
  console.log('Seeding initial leads...');
  const { data, error } = await supabase
    .from('leads')
    .insert(leads);

  if (error) {
    console.error('Error seeding leads:', error);
  } else {
    console.log('Successfully seeded leads.');
  }
}

seed();
