import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Database, BarChart, PieChart, TrendingUp, Target, Zap, Award } from 'lucide-react';

const Analytics = () => {
  const { mockMode } = useSettings();

  const MockChart = ({ title, value, sub }) => (
    <div className="glass-card p-8 flex flex-col h-64 justify-between">
      <div>
        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-4xl font-black text-slate-900">{value}</p>
      </div>
      <div className="flex items-end gap-1 h-24">
        {[30, 50, 40, 80, 60, 90, 70].map((h, i) => (
          <div key={i} className="flex-1 bg-indigo-50 rounded-t-lg relative group">
             <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600" style={{ height: `${h}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Reports</h1>
          <p className="text-slate-500 mt-2 font-medium">Measuring the ROI of your automated outreach.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MockChart title="Scan Volume" value="1,248" />
        <MockChart title="Conversion Rate" value="4.8%" />
        <MockChart title="Response Time" value="12m" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-8">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center">
            <Target className="w-5 h-5 mr-3 text-red-500" /> Industry Performance
          </h2>
          <div className="space-y-6">
            {[
              { name: 'Hair & Beauty Salons', count: 442, color: 'bg-indigo-500', w: 'w-[90%]' },
              { name: 'Medical Clinics', count: 218, color: 'bg-blue-500', w: 'w-[65%]' },
              { name: 'Law Firms', count: 125, color: 'bg-purple-500', w: 'w-[40%]' },
              { name: 'Boutique Hotels', count: 92, color: 'bg-slate-500', w: 'w-[25%]' },
            ].map((ind, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                  <span className="text-slate-700">{ind.name}</span>
                  <span className="text-slate-400">{ind.count} Leads</span>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${ind.color} rounded-full ${ind.w}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <Award className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500 opacity-20" />
              <h3 className="text-lg font-black mb-2">Projected Monthly ROI</h3>
              <p className="text-5xl font-black text-indigo-400 leading-tight">£2,450</p>
              <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Based on 12 converted leads</p>
           </div>

           <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-indigo-500">
              <div className="p-3 bg-indigo-50 rounded-xl">
                 <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Efficiency</p>
                 <p className="text-xl font-black text-slate-900">84.2% Optimization</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
