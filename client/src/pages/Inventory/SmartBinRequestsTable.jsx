import React, { useEffect, useState } from "react";
import axios from "axios";

const SmartBinRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "/api/BinRequest/smartbins"
        );
        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setRequests(fetchedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, binId, newStatus) => {
    try {
      const response = await axios.patch(
        `/api/BinRequest/update-bin-status/${requestId}/${binId}`,{
        status: newStatus 
    });
  
      const updatedRequest = response.data.updatedRequest;
  
      const updated = requests.map((req) => {
        return req._id === updatedRequest._id ? updatedRequest : req;
      });
  
      setRequests(updated);
    } catch (err) {
      console.error('Failed to update status:', err.message);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid rounded-full border-green-500 border-t-transparent"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-6">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              First Name
            </th>

            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Waste Type
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Quantity
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Bin Size
            </th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) =>
            request.binRequest?.map((bin, binIndex) => (
              <tr
                key={`${request._id}-${bin._id}-${binIndex}`}
                className="cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out border-b border-gray-300"
              >
                {/* Only show firstName on the first bin row */}
                {binIndex === 0 ? (
                  <td className="py-3 px-4" rowSpan={request.binRequest.length}>
                    {request.personalInfo?.firstName || "-"}
                  </td>
                ) : null}
                <td className="py-3 px-4">{bin.binType || "-"}</td>
                <td className="py-3 px-4">{bin.quantity || "-"}</td>
                <td className="py-3 px-4">{bin.binSize || "-"}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 rounded-full font-semibold text-white ${
                        bin.status === "pending"
                          ? "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          : "bg-gray-300 hover:bg-yellow-400"
                      }`}
                      onClick={() =>
                        handleStatusChange(request._id, bin._id, "pending")
                      }
                    >
                      Pending
                    </button>

                    <button
                      className={`px-3 py-1 rounded-full font-semibold text-white ${
                        bin.status === "cancelled"
                          ? "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          : "bg-gray-300 hover:bg-red-400"
                      }`}
                      onClick={() =>
                        handleStatusChange(request._id, bin._id, "cancelled")
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className={`px-3 py-1 rounded-full font-semibold text-white ${
                        bin.status === "approved"
                          ? "text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          : "bg-gray-300 hover:bg-green-400"
                      }`}
                      onClick={() =>
                        handleStatusChange(request._id, bin._id, "approved")
                      }
                    >
                      Approved
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SmartBinRequestsTable;
