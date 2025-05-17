import React from 'react';
import { useAppContext } from '../context/AppContext';

// Format number as currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const CapitalGainsCard = ({ isAfterHarvesting = false }) => {
  const { 
    capitalGains, 
    isLoadingCapitalGains, 
    calculatePostHarvesting, 
    calculateRealisedGains,
    calculateSavings
  } = useAppContext();
  
  // Determine which data to display based on the card type
  const gainsData = isAfterHarvesting ? calculatePostHarvesting() : capitalGains;
  
  // Calculate savings
  const savings = calculateSavings();
  const showSavings = isAfterHarvesting && savings > 0;
  
  // Calculate realised gains
  const realisedGains = calculateRealisedGains(gainsData);
  
  if (isLoadingCapitalGains) {
    return (
      <div className={`rounded-lg p-4 ${isAfterHarvesting ? 'bg-primary text-white' : 'bg-secondary text-white'} h-60 flex items-center justify-center`}>
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!gainsData) {
    return (
      <div className={`rounded-lg p-4 ${isAfterHarvesting ? 'bg-primary text-white' : 'bg-secondary text-white'} h-60 flex items-center justify-center`}>
        <div className="text-xl">No data available</div>
      </div>
    );
  }
  
  // Calculate net capital gains
  const stcgNet = gainsData.stcg.profits - gainsData.stcg.losses;
  const ltcgNet = gainsData.ltcg.profits - gainsData.ltcg.losses;
  
  return (
    <div className={`rounded-lg p-5 ${isAfterHarvesting ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
      <h3 className="text-lg font-medium mb-4">
        {isAfterHarvesting ? 'After Harvesting' : 'Before Harvesting'}
      </h3>
      
      <div className="space-y-6">
        {/* Short Term Capital Gains */}
        <div>
          <h4 className="text-sm opacity-80 mb-2">Short Term Capital Gains</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="opacity-70">Profits</p>
              <p className="font-medium">{formatCurrency(gainsData.stcg.profits)}</p>
            </div>
            <div>
              <p className="opacity-70">Losses</p>
              <p className="font-medium">{formatCurrency(gainsData.stcg.losses)}</p>
            </div>
            <div>
              <p className="opacity-70">Net</p>
              <p className="font-medium">{formatCurrency(stcgNet)}</p>
            </div>
          </div>
        </div>
        
        {/* Long Term Capital Gains */}
        <div>
          <h4 className="text-sm opacity-80 mb-2">Long Term Capital Gains</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="opacity-70">Profits</p>
              <p className="font-medium">{formatCurrency(gainsData.ltcg.profits)}</p>
            </div>
            <div>
              <p className="opacity-70">Losses</p>
              <p className="font-medium">{formatCurrency(gainsData.ltcg.losses)}</p>
            </div>
            <div>
              <p className="opacity-70">Net</p>
              <p className="font-medium">{formatCurrency(ltcgNet)}</p>
            </div>
          </div>
        </div>
        
        {/* Realised Capital Gains */}
        <div>
          <h4 className="text-sm opacity-80 mb-2">Realised Capital Gains</h4>
          <p className="font-semibold text-lg">{formatCurrency(realisedGains)}</p>
        </div>
        
        {/* Savings message */}
        {showSavings && (
          <div className="mt-4 bg-green-600 bg-opacity-20 px-3 py-2 rounded-md">
            <p className="text-sm">You're going to save {formatCurrency(savings)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalGainsCard;