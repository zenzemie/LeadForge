import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Database, BarChart, PieChart, TrendingUp, Target } from 'lucide-react';

const Analytics = () => {
  const { mockMode } = useSettings();

  const MockChart = ({ title, type }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700">{title}</h3>
        {type === 'bar' ? <BarChart className="w-4 h-4 text-blue-500" /> : <PieChart className="w-4 h-4 text-purple-500" />}
      </div>
      <div className="flex-1 flex items-end justify-around gap-2 px-2">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
          <div key={i} className="group relative flex-1">
            <div 
              className={`w-full rounded-t-lg transition-all duration-500 ${
                i === 3 ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-200'
              }`} 
              style={{ height: `${h}%` }}
            ></div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400 uppercase">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const ROIStat = ({ label, value, color }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Analytics</h1>
          <p className="text-gray-500 mt-1">Measuring the impact of your AI marketing efforts.</p>
        </div>
        {mockMode && (
          <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200">
            <Database className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-tight">Mock Insights</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MockChart title="Outreach Volume" type="bar" />
          <MockChart title="Reply Rate (%)" type="bar" />
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2 text-red-500" />
              Top Industries
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Salons', count: 42, color: 'w-[85%]' },
                { name: 'Clinics', count: 28, color: 'w-[60%]' },
                { name: 'Lawyers', count: 15, color: 'w-[35%]' },
                { name: 'Hotels', count: 12, color: 'w-[25%]' },
              ].map((ind, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{ind.name}</span>
                    <span className="text-gray-400">{ind.count} leads</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-blue-500 rounded-full ${ind.color}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              Conversion Funnel
            </h3>
            <div className="space-y-4">
              <ROIStat label="Leads Discovered" value="1,248" color="text-gray-900" />
              <ROIStat label="Outreach Sent" value="842" color="text-blue-600" />
              <ROIStat label="Active Replies" value="156" color="text-orange-600" />
              <ROIStat label="Closed Deals" value="12" color="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">ROI Impact</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Your AI Assistant has saved you approximately **42 hours** of manual research and outreach this month.
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 mb-1">Estimated Value</p>
              <p className="text-4xl font-black">£2,450</p>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
