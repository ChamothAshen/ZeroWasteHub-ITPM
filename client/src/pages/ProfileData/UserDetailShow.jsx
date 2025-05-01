import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiEye, FiTrash2, FiEdit } from "react-icons/fi";

const CollectionRequestsTable = () => {
  const [collectionRequests, setCollectionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    scheduleDate: "",
    location: "",
    binType: "",
    quantity: 1,
    description: "",
    contactNo: "",
    specialInstructions: "",
    status: "",
    paymentStatus: ""
  });
  
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

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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

  // Available waste types for dropdown
  const wasteTypes = [
    "general",
    "recycling",
    "compost",
    "paper",
    "electronics", 
    "hazardous"
  ];

  // Status options
  const statusOptions = [
    "pending",
    "scheduled",
    "in-progress",
    "completed",
    "cancelled"
  ];

  // Payment status options
  const paymentStatusOptions = [
    "pending",
    "completed",
    "failed",
    "refunded"
  ];

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

  // Handle edit request
  const handleEditRequest = (request) => {
    setCurrentRequest(request);
    setUpdateFormData({
      scheduleDate: formatDateForInput(request.scheduleDate),
      location: request.location || "",
      binType: request.binType || "",
      quantity: request.quantity || 1,
      description: request.description || "",
      contactNo: request.contactNo || "",
      specialInstructions: request.specialInstructions || "",
      status: request.status || "pending",
      paymentStatus: request.paymentStatus || "pending"
    });
    setShowUpdateModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value
    });
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3000/api/collection-requests/${currentRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateFormData),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update the state to reflect changes
        setCollectionRequests(collectionRequests.map(req => 
          req._id === currentRequest._id ? result.data : req
        ));
        setShowUpdateModal(false);
        alert("Request updated successfully");
      } else {
        alert(result.message || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      alert(`Error updating request: ${error.message}`);
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
                          {/* <button 
                            onClick={() => handleViewDetails(request._id)}
                            className="p-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button> */}
                          <button 
                            onClick={() => handleEditRequest(request)}
                            className="p-1.5 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                            title="Edit Request"
                          >
                            <FiEdit size={16} />
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

      {/* Update Modal */}
      {showUpdateModal && currentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-green-700">Update Collection Request</h2>
            
            <form onSubmit={handleUpdateSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Schedule Date */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Schedule Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="scheduleDate"
                    value={updateFormData.scheduleDate}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* Location */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={updateFormData.location}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* Bin Type */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Waste Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="binType"
                    value={updateFormData.binType}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Waste Type</option>
                    {wasteTypes.map(type => (
                      <option key={type} value={type}>
                        {wasteTypeIcons[type] || '🗑️'} {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={updateFormData.quantity}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="1"
                  />
                </div>
                
                {/* Contact Number */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={updateFormData.contactNo}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                
                {/* Status */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={updateFormData.status}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Payment Status */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={updateFormData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    {paymentStatusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={updateFormData.description}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                  rows="2"
                  required
                ></textarea>
              </div>
              
              {/* Special Instructions */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={updateFormData.specialInstructions}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                  rows="2"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionRequestsTable;