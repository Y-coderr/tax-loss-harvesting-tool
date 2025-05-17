import React from 'react';
import { useAppContext } from '../context/AppContext';

// Format number as currency
const formatCurrency = (amount) => {
  if (amount === 0) return '₹0';
  if (Math.abs(amount) < 0.01) return '< ₹0.01';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format number with appropriate precision
const formatNumber = (number) => {
  if (number === 0) return '0';
  
  // For very small numbers
  if (Math.abs(number) < 0.000001) {
    return number.toExponential(2);
  }
  
  // For small numbers (display more precision)
  if (Math.abs(number) < 0.01) {
    return number.toFixed(8);
  }
  
  // For medium numbers
  if (Math.abs(number) < 1000) {
    return number.toFixed(4);
  }
  
  // For larger numbers
  return new Intl.NumberFormat('en-IN').format(parseFloat(number.toFixed(2)));
};

const TableRow = ({ holding }) => {
  const { selectedHoldings, toggleHolding } = useAppContext();
  const isSelected = selectedHoldings.includes(holding.coin);
  
  // Get total gains (short-term + long-term)
  const totalGain = holding.stcg.gain + holding.ltcg.gain;
  
  // Determine gain/loss class
  const gainLossClass = totalGain > 0 
    ? 'text-green-500' 
    : totalGain < 0 
      ? 'text-red-500' 
      : '';
  
  return (
    <tr className={`border-b ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <td className="px-4 py-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleHolding(holding.coin)}
            className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex items-center">
            <img 
              src={holding.logo} 
              alt={holding.coin} 
              className="h-8 w-8 rounded-full mr-3 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
              }}
            />
            <div>
              <p className="font-medium">{holding.coin}</p>
              <p className="text-xs text-gray-500">{holding.coinName}</p>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p>{formatNumber(holding.totalHolding)}</p>
          <p className="text-xs text-gray-500">{formatCurrency(holding.averageBuyPrice)}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        {formatCurrency(holding.currentPrice)}
      </td>
      <td className="px-4 py-3">
        <div>
          <p className={holding.stcg.gain > 0 ? 'text-green-500' : holding.stcg.gain < 0 ? 'text-red-500' : ''}>
            {formatCurrency(holding.stcg.gain)}
          </p>
          {holding.stcg.balance > 0 && (
            <p className="text-xs text-gray-500">{formatNumber(holding.stcg.balance)}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className={holding.ltcg.gain > 0 ? 'text-green-500' : holding.ltcg.gain < 0 ? 'text-red-500' : ''}>
            {formatCurrency(holding.ltcg.gain)}
          </p>
          {holding.ltcg.balance > 0 && (
            <p className="text-xs text-gray-500">{formatNumber(holding.ltcg.balance)}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        {isSelected ? formatNumber(holding.totalHolding) : ''}
      </td>
    </tr>
  );
};

export default TableRow;