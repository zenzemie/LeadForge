import React, { useState } from 'react';

const Discovery = () => {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for ${category} in ${location}...`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Lead Discovery</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Category</label>
              <select 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="restaurant">Restaurant</option>
                <option value="salon">Salon</option>
                <option value="clinic">Clinic</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input 
                type="text" 
                placeholder="e.g. New York, NY"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Start Discovery
          </button>
        </form>
      </div>
    </div>
  );
};

export default Discovery;
