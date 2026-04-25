import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Emails Sent</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Replies</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Converted</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
