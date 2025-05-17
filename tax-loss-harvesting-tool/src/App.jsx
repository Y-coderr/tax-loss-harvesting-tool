import React from 'react';
import { AppProvider } from './context/AppContext';
import CapitalGainsCard from './components/CapitalGainsCard';
import HoldingsTable from './components/HoldingsTable';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container-custom">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Tax Loss Harvesting</h1>
          
          {/* Capital Gains Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <CapitalGainsCard isAfterHarvesting={false} />
            <CapitalGainsCard isAfterHarvesting={true} />
          </div>
          
          {/* Holdings Table */}
          <HoldingsTable />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;