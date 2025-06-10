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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg border border-blue-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Bin Size</th>
                  <th className="px-4 py-2 text-center">Available</th>
                  <th className="px-4 py-2 text-center">Dispatched</th>
                </tr>
              </thead>
              <tbody>
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
                    <tr key={key} className="border-t">
                      <td className="px-4 py-2 font-semibold text-gray-700">
                        {binSize.charAt(0).toUpperCase() + binSize.slice(1)} Bin
                      </td>
                      
                      <td className={`px-4 py-2 text-center ${colors.bg}`}>
                        <span className="text-xl font-bold text-blue-600">{counts.availableCount}</span>
                      </td>
                      <td className="px-4 py-2 text-center bg-green-50">
                        <span className="text-xl font-bold text-green-600">{counts.dispatchedCount}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WasteBinCounts;
