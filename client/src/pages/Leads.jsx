import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads } from '../api/leads';
import { Filter, Search as SearchIcon, ArrowRight, Star, Database, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Leads = () => {
  const { mockMode } = useSettings();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [mockMode]);

  useEffect(() => {
    const filtered = leads.filter(lead => {
      const name = lead.name || '';
      const industry = lead.industry || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredLeads(filtered);
  }, [searchQuery, statusFilter, leads]);

  const fetchLeads = async () => {
    setLoading(true);
    if (mockMode) {
      const mockLeads = [
        { id: '1', name: 'Elite Salon', industry: 'salon', score: 88, status: 'sent', created_at: new Date().toISOString() },
        { id: '2', name: 'City Dental', industry: 'clinic', score: 75, status: 'replied', created_at: new Date().toISOString() },
        { id: '3', name: 'The Hub Cafe', industry: 'restaurant', score: 92, status: 'converted', created_at: new Date().toISOString() },
        { id: '4', name: 'Elite Gym', industry: 'gym', score: 65, status: 'not_contacted', created_at: new Date().toISOString() },
      ];
      setLeads(mockLeads);
      setLoading(false);
      return;
    }

    try {
      const response = await getLeads();
      setLeads(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lead Management</h1>
          <p className="text-slate-500 mt-2 font-medium">Review and qualify your discovered businesses.</p>
        </div>
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center shadow-xl shadow-slate-100">
        <div className="relative flex-1 w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search leads by name or industry..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            className="bg-slate-50 border-none rounded-xl py-3 pl-4 pr-10 font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="not_contacted">Not Contacted</option>
            <option value="sent">Sent</option>
            <option value="replied">Replied</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl shadow-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Lead Identity</th>
                <th className="px-8 py-5">AI Score</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse">Loading database...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold italic">No leads matching filters.</td></tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">{lead.name.charAt(0)}</div>
                         <div>
                           <p className="font-black text-slate-800">{lead.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{lead.industry}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: `${lead.score}%` }}></div>
                        </div>
                        <span className="text-sm font-black text-indigo-600">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`status-badge ${
                        lead.status === 'sent' ? 'bg-indigo-50 text-indigo-600' : 
                        lead.status === 'not_contacted' ? 'bg-slate-100 text-slate-400' : 
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="btn-secondary py-2 px-4 text-xs group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
                      >
                        Open Hub <ArrowRight className="w-3 h-3 ml-2" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Leads;
