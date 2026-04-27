import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { discoverLeads } from '../api/leads';

const Discovery = () => {
  const navigate = useNavigate();
  const { mockMode } = useSettings();
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (mockMode) {
      setTimeout(() => {
        setResults([
          { id: 'demo-1', name: 'Elite Dental', score: 95, website: 'https://example.com', phone: '020 1234 5678' },
          { id: 'demo-2', name: 'The Golden Cafe', score: 82, website: 'https://cafe.com', phone: '020 8765 4321' }
        ]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await discoverLeads({ category, location });
      setResults(response.data.leads || []);
    } catch (err) {
      console.error(err);
      setResults([{ id: 'demo-err', name: 'Demo: ' + category, score: 50, notes: 'API Error Fallback' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Discovery</h1>
        <Sparkles className="text-indigo-600" />
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input className="flex-1 p-4 bg-slate-50 rounded-xl" placeholder="Industry..." value={category} onChange={e => setCategory(e.target.value)} required />
          <input className="flex-1 p-4 bg-slate-50 rounded-xl" placeholder="City..." value={location} onChange={e => setLocation(e.target.value)} required />
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 rounded-xl font-bold">
            {loading ? <Loader2 className="animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map(lead => (
          <div key={lead.id} className="bg-white p-6 rounded-2xl border hover:border-indigo-500 transition-all">
            <h3 className="text-xl font-black">{lead.name}</h3>
            <p className="text-indigo-600 font-bold mt-2">Match Score: {lead.score}</p>
            <button onClick={() => navigate(`/leads/${lead.id}`)} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center">
              Open Outreach Hub <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Discovery;
