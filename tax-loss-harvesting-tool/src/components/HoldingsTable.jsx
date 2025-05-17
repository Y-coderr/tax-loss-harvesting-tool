import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import TableRow from './TableRow';

const HoldingsTable = () => {
  const { 
    holdings, 
    isLoadingHoldings, 
    holdingsError, 
    selectedHoldings, 
    toggleSelectAll,
    viewAll, 
    toggleViewAll,
    displayCount
  } = useAppContext();
  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  
  // Sort holdings based on current sort configuration
  const sortedHoldings = React.useMemo(() => {
    if (!holdings) return [];
    
    const sortableHoldings = [...holdings];
    
    if (sortConfig.key) {
      sortableHoldings.sort((a, b) => {
        // Handle nested properties
        let aValue, bValue;
        
        if (sortConfig.key === 'stcg.gain') {
          aValue = a.stcg.gain;
          bValue = b.stcg.gain;
        } else if (sortConfig.key === 'ltcg.gain') {
          aValue = a.ltcg.gain;
          bValue = b.ltcg.gain;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        // Handle string comparison
        if (typeof aValue === 'string') {
          if (sortConfig.direction === 'ascending') {
            return aValue.localeCompare(bValue);
          }
          return bValue.localeCompare(aValue);
        }
        
        // Handle number comparison
        if (sortConfig.direction === 'ascending') {
          return aValue - bValue;
        }
        return bValue - aValue;
      });
    }
    
    return sortableHoldings;
  }, [holdings, sortConfig]);
  
  // Request sort on a specific column
  const requestSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };
  
  // Get displayed holdings based on viewAll state
  const displayedHoldings = sortedHoldings.slice(0, displayCount);
  
  // Handle checkbox selection
  const allSelected = holdings.length > 0 && selectedHoldings.length === holdings.length;
  const someSelected = selectedHoldings.length > 0 && selectedHoldings.length < holdings.length;
  
  if (isLoadingHoldings) {
    return (
      <div className="bg-white rounded-lg p-6 mt-8 shadow">
        <div className="animate-pulse flex flex-col space-y-4 items-center justify-center py-12">
          <div className="h-8 w-8 bg-gray-300 rounded-full animate-spin"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (holdingsError) {
    return (
      <div className="bg-white rounded-lg p-6 mt-8 shadow">
        <div className="text-center py-12 text-red-500">
          <p>{holdingsError}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Holdings</h3>
        <button 
          onClick={toggleViewAll}
          className="text-primary font-medium text-sm"
        >
          {viewAll ? 'View Less' : 'View All'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = someSelected && !allSelected;
                      }
                    }}
                    onChange={toggleSelectAll}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span 
                    className="cursor-pointer"
                    onClick={() => requestSort('coin')}
                  >
                    Asset {getSortDirectionIndicator('coin')}
                  </span>
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('totalHolding')}
              >
                Holdings & Avg Buy Price {getSortDirectionIndicator('totalHolding')}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('currentPrice')}
              >
                Current Price {getSortDirectionIndicator('currentPrice')}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('stcg.gain')}
              >
                Short-Term Gain {getSortDirectionIndicator('stcg.gain')}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('ltcg.gain')}
              >
                Long-Term Gain {getSortDirectionIndicator('ltcg.gain')}
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount to Sell
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedHoldings.length > 0 ? (
              displayedHoldings.map((holding) => (
                <TableRow key={holding.coin} holding={holding} />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No holdings data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {!viewAll && holdings.length > 10 && (
        <div className="px-4 py-3 border-t text-center">
          <button 
            onClick={toggleViewAll}
            className="text-primary font-medium text-sm"
          >
            View All ({holdings.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;