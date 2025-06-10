import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const WasteBinCounts = () => {
  const [binCounts, setBinCounts] = useState({});
  const binSizes = ['small', 'medium', 'large', 'xlarge', 'commercial'];
  const wasteTypes = ['general', 'glass', 'compost', 'plastic', 'paper'];

  // Define colors for each waste type
  const wasteTypeColors = {
    plastic: { icon: 'text-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    paper: { icon: 'text-green-500', bg: 'bg-green-50', text: 'text-green-600' },
    compost: { icon: 'text-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
    general: { icon: 'text-red-500', bg: 'bg-red-50', text: 'text-red-600' },
    glass: { icon: 'text-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
  };

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
              `/api/Request/bin-status-count/${wasteType}/${binSize}`
            );

            const approvedCount = response.data?.[0]?.approvedCount || 0;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {binSizes.map((binSize) => {
              const key = `${wasteType}_${binSize}`;
              const counts = binCounts[key] || { availableCount: 0, dispatchedCount: 0 };

              // Get colors for the current waste type
              const colors = wasteTypeColors[wasteType] || {
                icon: 'text-gray-500',
                bg: 'bg-gray-50',
                text: 'text-gray-600',
              };

              return (
                <div
                  key={key}
                  className={`w-full bg-white rounded-lg shadow-lg flex flex-col items-center p-4 transform hover:scale-105 transition-transform border border-blue-200`}
                >
                  <div className={`${colors.icon} mb-2`}>
                    <FaTrash className="text-4xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {binSize.charAt(0).toUpperCase() + binSize.slice(1)} Bin
                  </h3>
                  <div className="flex gap-4 mt-2 w-full">
                    <div className={`flex-1 text-center ${colors.bg} p-1 rounded-lg`}>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="text-xl font-bold text-blue-600">{counts.availableCount}</p>
                    </div>
                    <div className="flex-1 text-center bg-green-50 p-1 rounded-lg">
                      <p className="text-xs text-gray-500">Dispatched</p>
                      <p className="text-xl font-bold text-green-600">{counts.dispatchedCount}</p>
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
