import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const WasteBinCounts = () => {
  const [binCounts, setBinCounts] = useState({});
  const binSizes = ['small', 'medium', 'large', 'xlarge', 'commercial'];
  const wasteTypes = ['general', 'glass', 'compost', 'plastic', 'paper'];

  useEffect(() => {
    const fetchBinCounts = async () => {
      try {
        const newBinCounts = {};
  
        // Initialize all combinations to 0
        for (let wasteType of wasteTypes) {
          for (let binSize of binSizes) {
            const key = `${wasteType}_${binSize}`;
            newBinCounts[key] = {
              availableCount: 0,
              dispatchedCount: 0,
            };
          }
        }
  
        // Then fetch and update actual values
        for (let wasteType of wasteTypes) {
          for (let binSize of binSizes) {
            const response = await axios.get(
              `http://localhost:3000/api/Request/bin-status-count/${wasteType}/${binSize}`
            );
  
            const approvedCount = response.data?.[0]?.approvedCount || 0;
  
            // Log the approvedCount for each wasteType and binSize combination
            console.log(`Approved count for ${wasteType} - ${binSize}:`, approvedCount);
  
            newBinCounts[`${wasteType}_${binSize}`] = {
              availableCount: 80 - approvedCount,
              dispatchedCount: approvedCount,
            };
          }
        }
  
        setBinCounts(newBinCounts);
      } catch (error) {
        console.error('Error fetching bin counts:', error.message);
      }
    };
  
    fetchBinCounts();
  }, []);
  

  return (
    <div className="space-y-6">
      {wasteTypes.map((wasteType) => (
        <div key={wasteType} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">
            {wasteType.charAt(0).toUpperCase() + wasteType.slice(1)} Waste
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {binSizes.map((binSize) => {
              const key = `${wasteType}_${binSize}`;
              const counts = binCounts[key] || { availableCount: 0, dispatchedCount: 0 };

              return (
                <div
                  key={key}
                  className="w-full bg-white rounded-lg shadow-lg flex items-center p-4 transform hover:scale-105 transition-transform border border-blue-200"
                >
                  <div className="flex-shrink-0">
                    <FaTrash className="text-4xl text-green-600 mb-2" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mt-0">
                      {binSize.charAt(0).toUpperCase() + binSize.slice(1)} Bin
                    </h3>
                    <div className="flex gap-4 mt-2">
                      <div className="flex-1 text-center bg-blue-50 p-2 rounded-lg">
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="text-xl font-bold text-blue-600">{counts.availableCount}</p>
                      </div>
                      <div className="flex-1 text-center bg-green-50 p-2 rounded-lg">
                        <p className="text-sm text-gray-500">Dispatched</p>
                        <p className="text-xl font-bold text-green-600">{counts.dispatchedCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WasteBinCounts;
