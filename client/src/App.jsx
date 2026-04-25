import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Search } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Discovery from './pages/Discovery';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600">LeadForge</h1>
          </div>
          <nav className="mt-6">
            <Link to="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/leads" className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Users className="w-5 h-5 mr-3" />
              Leads
            </Link>
            <Link to="/discovery" className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Search className="w-5 h-5 mr-3" />
              Discovery
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm p-4">
            <h2 className="text-xl font-semibold text-gray-800">AI Outreach Agent</h2>
          </header>
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/discovery" element={<Discovery />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
