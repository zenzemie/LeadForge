import React, { useState, useEffect } from 'react';
import { getLeads } from '../api/leads';
import { Users, Mail, Reply, CheckCircle, Activity, Database, Zap, TrendingUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Dashboard = () => {
  const { mockMode } = useSettings();
  const [stats, setStats] = useState({
    totalLeads: 0,
    emailsSent: 0,
    replies: 0,
    converted: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [mockMode]);

  const fetchData = async () => {
    setLoading(true);
    if (mockMode) {
      setStats({ totalLeads: 45, emailsSent: 32, replies: 12, converted: 3 });
      setRecentLeads([
        { id: '1', name: 'Elite Salon', industry: 'salon', score: 88, status: 'sent', created_at: new Date().toISOString() },
        { id: '2', name: 'City Dental', industry: 'clinic', score: 75, status: 'replied', created_at: new Date().toISOString() },
        { id: '3', name: 'The Hub Cafe', industry: 'restaurant', score: 92, status: 'converted', created_at: new Date().toISOString() },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await getLeads();
      const leads = response.data || [];
      setStats({
        totalLeads: leads.length,
        emailsSent: leads.filter(l => ['sent', 'replied'].includes(l.status)).length,
        replies: leads.filter(l => l.status === 'replied').length,
        converted: leads.filter(l => l.status === 'converted').length
      });
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="glass-card p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+{trend}%</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );

  if (loading) return <div className="py-20 text-center font-bold text-slate-400 animate-pulse">Initializing Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-2 font-medium">Your AI Outreach performance at a glance.</p>
        </div>
        {mockMode && <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-amber-200">Demo Intelligence</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={Users} color="text-blue-600 bg-blue-600" trend="12" />
        <StatCard title="Outreach Sent" value={stats.emailsSent} icon={Mail} color="text-indigo-600 bg-indigo-600" trend="24" />
        <StatCard title="Active Replies" value={stats.replies} icon={Reply} color="text-purple-600 bg-purple-600" trend="8" />
        <StatCard title="Conversions" value={stats.converted} icon={CheckCircle} color="text-emerald-600 bg-emerald-600" trend="15" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-black text-slate-800 uppercase tracking-tight flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-600" /> Recent Intelligence
            </h2>
            <button onClick={() => fetchData()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Refresh</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{lead.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lead.industry} • {new Date(lead.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`status-badge ${lead.status === 'sent' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  {lead.status}
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-400 font-bold italic">No activity recorded. Start a discovery scan.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
            <h3 className="text-xl font-black mb-4">80/20 Strategy</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
              Your AI handles the repetitive research. Your job is to close the leads that reply.
            </p>
            <div className="space-y-3">
              {['Analyze Competitors', 'Perfect the Pitch', 'Schedule Demo'].map((step, i) => (
                <div key={i} className="flex items-center text-xs font-bold">
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center mr-3">{i+1}</div>
                  {step}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-center mb-2">
               <TrendingUp className="w-4 h-4 text-emerald-500 mr-2" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Gain</span>
            </div>
            <p className="text-2xl font-black text-slate-900">+42 Hours</p>
            <p className="text-xs font-bold text-slate-400 mt-1">Saved this month via AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
