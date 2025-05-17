import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchHoldings, fetchCapitalGains } from '../api/mockApi';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State for API data
  const [holdings, setHoldings] = useState([]);
  const [capitalGains, setCapitalGains] = useState(null);
  
  // State for selected holdings
  const [selectedHoldings, setSelectedHoldings] = useState([]);
  
  // Loading states
  const [isLoadingHoldings, setIsLoadingHoldings] = useState(true);
  const [isLoadingCapitalGains, setIsLoadingCapitalGains] = useState(true);
  
  // Error states
  const [holdingsError, setHoldingsError] = useState(null);
  const [capitalGainsError, setCapitalGainsError] = useState(null);

  // View all state
  const [viewAll, setViewAll] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  
  // Fetch holdings data
  useEffect(() => {
    const getHoldings = async () => {
      try {
        const data = await fetchHoldings();
        setHoldings(data);
        setIsLoadingHoldings(false);
      } catch (error) {
        setHoldingsError('Failed to load holdings data');
        setIsLoadingHoldings(false);
      }
    };
    
    getHoldings();
  }, []);
  
  // Fetch capital gains data
  useEffect(() => {
    const getCapitalGains = async () => {
      try {
        const data = await fetchCapitalGains();
        setCapitalGains(data.capitalGains);
        setIsLoadingCapitalGains(false);
      } catch (error) {
        setCapitalGainsError('Failed to load capital gains data');
        setIsLoadingCapitalGains(false);
      }
    };
    
    getCapitalGains();
  }, []);
  
  // Calculate post-harvesting capital gains
  const calculatePostHarvesting = () => {
    if (!capitalGains) return null;
    
    // Initialize with original capital gains
    const postHarvesting = {
      stcg: { ...capitalGains.stcg },
      ltcg: { ...capitalGains.ltcg }
    };
    
    // Update based on selected holdings
    selectedHoldings.forEach((holdingId) => {
      const holding = holdings.find(h => h.coin === holdingId);
      if (holding) {
        // Short Term Capital Gains/Losses
        if (holding.stcg.gain > 0) {
          postHarvesting.stcg.profits -= holding.stcg.gain;
        } else if (holding.stcg.gain < 0) {
          postHarvesting.stcg.losses -= Math.abs(holding.stcg.gain);
        }
        
        // Long Term Capital Gains/Losses
        if (holding.ltcg.gain > 0) {
          postHarvesting.ltcg.profits -= holding.ltcg.gain;
        } else if (holding.ltcg.gain < 0) {
          postHarvesting.ltcg.losses -= Math.abs(holding.ltcg.gain);
        }
      }
    });
    
    // Ensure no negative values
    postHarvesting.stcg.profits = Math.max(0, postHarvesting.stcg.profits);
    postHarvesting.stcg.losses = Math.max(0, postHarvesting.stcg.losses);
    postHarvesting.ltcg.profits = Math.max(0, postHarvesting.ltcg.profits);
    postHarvesting.ltcg.losses = Math.max(0, postHarvesting.ltcg.losses);
    
    return postHarvesting;
  };
  
  // Toggle selection of a holding
  const toggleHolding = (holdingId) => {
    setSelectedHoldings(prev => 
      prev.includes(holdingId) 
        ? prev.filter(id => id !== holdingId) 
        : [...prev, holdingId]
    );
  };
  
  // Toggle select all holdings
  const toggleSelectAll = () => {
    if (selectedHoldings.length === holdings.length) {
      setSelectedHoldings([]);
    } else {
      setSelectedHoldings(holdings.map(h => h.coin));
    }
  };
  
  // Toggle view all functionality
  const toggleViewAll = () => {
    setViewAll(!viewAll);
    setDisplayCount(viewAll ? 10 : holdings.length);
  };
  
  // Calculate realised capital gains
  const calculateRealisedGains = (gains) => {
    if (!gains) return 0;
    const stcgNet = gains.stcg.profits - gains.stcg.losses;
    const ltcgNet = gains.ltcg.profits - gains.ltcg.losses;
    return stcgNet + ltcgNet;
  };
  
  // Calculate tax savings
  const calculateSavings = () => {
    if (!capitalGains) return 0;
    
    const preHarvestingRealised = calculateRealisedGains(capitalGains);
    const postHarvestingRealised = calculateRealisedGains(calculatePostHarvesting());
    
    return Math.max(0, preHarvestingRealised - postHarvestingRealised);
  };
  
  const value = {
    holdings,
    capitalGains,
    selectedHoldings,
    isLoadingHoldings,
    isLoadingCapitalGains,
    holdingsError,
    capitalGainsError,
    viewAll,
    displayCount,
    toggleHolding,
    toggleSelectAll,
    toggleViewAll,
    calculatePostHarvesting,
    calculateRealisedGains,
    calculateSavings
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};