import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiEye, FiTrash2 } from "react-icons/fi";

const CollectionRequestsTable = () => {
  const [collectionRequests, setCollectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // You can use this ID or get it from localStorage/context in a real app
  const userId = 'bb797925-dfae-4531-aadd-294a87fd73f2';

  // Fetch all collection requests
  const fetchCollectionRequests = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch all requests or just for the current user
      // const response = await fetch(`http://localhost:3000/api/collection-requests/user/${userId}`);
      const response = await fetch(`http://localhost:3000/api/collection-requests`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCollectionRequests(result.data);
        console.log("Fetched collection requests:", result.data);
      } else {
        setError(result.message || "Failed to fetch collection requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(`Failed to fetch requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCollectionRequests();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Waste type icons
  const wasteTypeIcons = {
    general: "🗑️",
    recycling: "♻️",
    compost: "🌱",
    paper: "📄",
    electronics: "💻",
    hazardous: "⚠️"
  };

  // Handle view details
  const handleViewDetails = (requestId) => {
    // In a real app, you might navigate to a details page
    console.log("View details for request:", requestId);
    alert(`View details for request: ${requestId}`);
  };

  // Handle delete request
  const handleDeleteRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this collection request?")) {
      try {
        const response = await fetch(`http://localhost:3000/api/collection-requests/${requestId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Remove from state to update UI immediately
          setCollectionRequests(collectionRequests.filter(req => req._id !== requestId));
          alert("Request deleted successfully");
        } else {
          alert(result.message || "Failed to delete request");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        alert(`Error deleting request: ${error.message}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-200">
        <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">Collection Requests</h1>
          <button 
            onClick={fetchCollectionRequests}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : collectionRequests.length === 0 ? (
            <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">
              No collection requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-100">
                    <th className="px-4 py-3 text-left text-green-800">Request ID</th>
                    <th className="px-4 py-3 text-left text-green-800">Waste Type</th>
                    <th className="px-4 py-3 text-left text-green-800">Location</th>
                    <th className="px-4 py-3 text-left text-green-800">Schedule Date</th>
                    <th className="px-4 py-3 text-left text-green-800">Contact</th>
                    <th className="px-4 py-3 text-left text-green-800">Status</th>
                    <th className="px-4 py-3 text-left text-green-800">Payment</th>
                    <th className="px-4 py-3 text-center text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collectionRequests.map((request) => (
                    <tr key={request._id} className="border-b border-gray-200 hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-sm">
                        {request.requestId ? request.requestId.substring(0, 8) + '...' : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center">
                          {wasteTypeIcons[request.binType] || '🗑️'} {request.binType}
                        </span>
                      </td>
                      <td className="px-4 py-3 truncate max-w-[150px]" title={request.location}>
                        {request.location}
                      </td>
                      <td className="px-4 py-3">
                        <div>{formatDate(request.scheduleDate)}</div>
                        <div className="text-xs text-gray-500">{formatTime(request.scheduleDate)}</div>
                      </td>
                      <td className="px-4 py-3">{request.contactNo}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${request.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                          ${request.status === 'in-progress' ? 'bg-purple-100 text-purple-800' : ''}
                          ${request.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${request.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${request.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${request.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${request.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : ''}
                          ${request.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {request.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => handleViewDetails(request._id)}
                            className="p-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRequest(request._id)}
                            className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                            title="Delete Request"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionRequestsTable;