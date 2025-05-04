import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiEye, FiTrash2, FiEdit, FiX, FiCalendar, FiMapPin, 
  FiPackage, FiHash, FiPhone, FiFileText, FiAlertCircle, FiLock, FiDollarSign, 
  FiFilter, FiSearch, FiChevronDown } from "react-icons/fi";

const CollectionRequestsTable = () => {
  const [collectionRequests, setCollectionRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
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
    paymentStatus: "",
    price: ""
  });
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWasteType, setSelectedWasteType] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // You can use this ID or get it from localStorage/context in a real app
  const userId = 'bb797925-dfae-4531-aadd-294a87fd73f2';

  // Pricing table for different bin types
  const binPrices = {
    general: 1500,
    recycling: 2000,
    compost: 2500,
    paper: 1800,
    electronics: 3000,
    hazardous: 4000
  };

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
        // Make sure all requests have a price field
        const requestsWithPrice = result.data.map(request => {
          // If the request already has a price, use it; otherwise calculate based on bin type and quantity
          if (!request.price && request.binType) {
            request.price = calculatePrice(request.binType, request.quantity || 1);
          }
          return request;
        });
        
        setCollectionRequests(requestsWithPrice);
        setFilteredRequests(requestsWithPrice);
        console.log("Fetched collection requests:", requestsWithPrice);
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

  // Apply filters whenever searchTerm or selectedWasteType changes
  useEffect(() => {
    filterRequests();
  }, [searchTerm, selectedWasteType, collectionRequests]);

  // Filter requests based on search term and waste type
  const filterRequests = () => {
    let filtered = [...collectionRequests];
    
    // Filter by waste type if selected
    if (selectedWasteType) {
      filtered = filtered.filter(request => 
        request.binType === selectedWasteType
      );
    }
    
    // Filter by search term if present
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(request => 
        (request.location && request.location.toLowerCase().includes(term)) ||
        (request.description && request.description.toLowerCase().includes(term)) ||
        (request.contactNo && request.contactNo.includes(term)) ||
        (request.requestId && request.requestId.toLowerCase().includes(term))
      );
    }
    
    setFilteredRequests(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle waste type filter change
  const handleWasteTypeChange = (type) => {
    setSelectedWasteType(type);
    setShowFilterDropdown(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedWasteType("");
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

  // Format price for display
  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return `Rs. ${parseFloat(price).toLocaleString()}`;
  };

  // Calculate price based on bin type and quantity
  const calculatePrice = (binType, quantity = 1) => {
    const basePrice = binPrices[binType] || 0;
    return basePrice * quantity;
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

  // Get display name for status
  const getStatusDisplayName = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status background color
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status background color
  const getPaymentStatusBgColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          const updatedRequests = collectionRequests.filter(req => req._id !== requestId);
          setCollectionRequests(updatedRequests);
          setFilteredRequests(updatedRequests.filter(req => 
            (!selectedWasteType || req.binType === selectedWasteType) &&
            (!searchTerm || 
              req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
              req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              req.contactNo.includes(searchTerm) ||
              req.requestId.toLowerCase().includes(searchTerm.toLowerCase())
            )
          ));
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
    
    // Get price or calculate based on bin type and quantity
    const currentPrice = request.price || calculatePrice(request.binType, request.quantity);
    
    setUpdateFormData({
      scheduleDate: formatDateForInput(request.scheduleDate),
      location: request.location || "",
      binType: request.binType || "",
      quantity: request.quantity || 1,
      description: request.description || "",
      contactNo: request.contactNo || "",
      specialInstructions: request.specialInstructions || "",
      status: request.status || "pending",
      paymentStatus: request.paymentStatus || "pending",
      price: currentPrice.toString() // Convert to string for form input
    });
    
    setShowUpdateModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setUpdateFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value
      };
      
      // If bin type or quantity changes, recalculate price
      if (name === 'binType' || name === 'quantity') {
        // Only update price if it wasn't manually edited
        const calculatedPrice = calculatePrice(
          name === 'binType' ? value : prevData.binType,
          name === 'quantity' ? parseInt(value) : parseInt(prevData.quantity)
        );
        
        newData.price = calculatedPrice.toString();
      }
      
      return newData;
    });
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert price to number for API
      const dataToSubmit = {
        ...updateFormData,
        price: parseFloat(updateFormData.price) || 0,
        quantity: parseInt(updateFormData.quantity) || 1
      };
      
      const response = await fetch(`http://localhost:3000/api/collection-requests/${currentRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update the state to reflect changes
        const updatedRequests = collectionRequests.map(req => 
          req._id === currentRequest._id ? result.data : req
        );
        setCollectionRequests(updatedRequests);
        // Re-apply filters
        filterRequests();
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
        
        {/* Filter and Search Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by location, description, contact or ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Waste Type Filter Dropdown */}
            <div className="relative">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <FiFilter className="text-gray-600" />
                  <span>
                    {selectedWasteType 
                      ? `${wasteTypeIcons[selectedWasteType]} ${getStatusDisplayName(selectedWasteType)}` 
                      : "Filter by Waste Type"}
                  </span>
                  <FiChevronDown className="text-gray-500" />
                </button>
                
                {selectedWasteType && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    title="Clear filters"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              
              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <ul className="py-1 max-h-60 overflow-auto">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleWasteTypeChange("")}
                        className={`w-full text-left px-4 py-2 hover:bg-green-50 flex items-center ${!selectedWasteType ? 'bg-green-50 text-green-700 font-medium' : ''}`}
                      >
                        All Waste Types
                      </button>
                    </li>
                    {wasteTypes.map(type => (
                      <li key={type}>
                        <button
                          type="button"
                          onClick={() => handleWasteTypeChange(type)}
                          className={`w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-2 ${selectedWasteType === type ? 'bg-green-50 text-green-700 font-medium' : ''}`}
                        >
                          <span>{wasteTypeIcons[type]}</span>
                          <span>{getStatusDisplayName(type)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Filter Summary */}
          {(searchTerm || selectedWasteType) && (
            <div className="mt-3 flex items-center text-sm text-gray-600">
              <span className="mr-2">Showing results for:</span>
              {selectedWasteType && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2 flex items-center gap-1">
                  {wasteTypeIcons[selectedWasteType]} {getStatusDisplayName(selectedWasteType)}
                </span>
              )}
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <FiSearch size={12} /> "{searchTerm}"
                </span>
              )}
              <button
                onClick={clearFilters}
                className="ml-auto text-green-600 hover:text-green-800 text-sm underline flex items-center gap-1"
              >
                <FiX size={14} /> Clear filters
              </button>
            </div>
          )}
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
          ) : filteredRequests.length === 0 ? (
            <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">
              {collectionRequests.length === 0 
                ? "No collection requests found."
                : "No requests match your search criteria. Try adjusting your filters."}
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
                    <th className="px-4 py-3 text-left text-green-800">Price</th>
                    <th className="px-4 py-3 text-left text-green-800">Payment</th>
                    <th className="px-4 py-3 text-center text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
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
                      <td className="px-4 py-3 font-medium">
                        {formatPrice(request.price || calculatePrice(request.binType, request.quantity))}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBgColor(request.paymentStatus)}`}>
                          {request.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
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
          
          {/* Results Count */}
          {!loading && !error && filteredRequests.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredRequests.length} of {collectionRequests.length} collection requests
            </div>
          )}
        </div>
      </div>

      {/* Update Modal with Price Field */}
      {showUpdateModal && currentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all"
            style={{animation: 'fadeIn 0.3s ease-out'}}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-5 rounded-t-xl relative">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiEdit className="text-white" size={20} />
                  Update Collection Request
                </h2>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white focus:outline-none"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {/* Request ID display */}
              <div className="mt-2 text-green-100 text-sm">
                Request ID: <span className="font-mono">{currentRequest.requestId ? currentRequest.requestId : 'N/A'}</span>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                {/* Top Section - grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Schedule Date */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiCalendar className="text-green-600" />
                      Schedule Date <span className="text-red-500"></span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="scheduleDate"
                        value={updateFormData.scheduleDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiMapPin className="text-green-600" />
                      Location <span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={updateFormData.location}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      required
                    />
                  </div>
                  
                  {/* Bin Type */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiPackage className="text-green-600" />
                      Waste Type <span className="text-red-500"></span>
                    </label>
                    <select
                      name="binType"
                      value={updateFormData.binType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      required
                    >
                      <option value="">Select Waste Type</option>
                      {wasteTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiHash className="text-green-600" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={updateFormData.quantity}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      min="1"
                    />
                  </div>
                  
                  {/* Price Field */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiDollarSign className="text-green-600" />
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={updateFormData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Price is calculated based on waste type and quantity
                    </p>
                  </div>
                  
                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiPhone className="text-green-600" />
                      Contact Number <span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      name="contactNo"
                      value={updateFormData.contactNo}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      required
                    />
                  </div>
                  
                  {/* Status Display - Read Only */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiLock className="text-gray-500" />
                      Status <span className="text-xs text-gray-500 font-normal ml-2">(Read-only)</span>
                    </label>
                    <div className="w-full border border-gray-200 bg-gray-100 rounded-lg py-2.5 px-4 flex items-center gap-2 cursor-not-allowed">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBgColor(updateFormData.status)}`}>
                        {getStatusDisplayName(updateFormData.status)}
                      </span>
                      <span className="text-gray-400 text-sm ml-auto italic">Managed by system</span>
                    </div>
                  </div>
                  
                  {/* Payment Status Display - Read Only */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiLock className="text-gray-500" />
                      Payment Status <span className="text-xs text-gray-500 font-normal ml-2">(Read-only)</span>
                    </label>
                    <div className="w-full border border-gray-200 bg-gray-100 rounded-lg py-2.5 px-4 flex items-center gap-2 cursor-not-allowed">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBgColor(updateFormData.paymentStatus)}`}>
                        {getStatusDisplayName(updateFormData.paymentStatus)}
                      </span>
                      <span className="text-gray-400 text-sm ml-auto italic">Managed by system</span>
                    </div>
                  </div>
                </div>
                
                {/* Text Areas with Icons */}
                <div className="space-y-5">
                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiFileText className="text-green-600" />
                      Description <span className="text-red-500"></span>
                    </label>
                    <textarea
                      name="description"
                      value={updateFormData.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  
                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700 font-medium gap-2">
                      <FiAlertCircle className="text-green-600" />
                      Special Instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={updateFormData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-colors"
                      rows="2"
                      placeholder="Any special handling instructions or notes"
                    ></textarea>
                  </div>
                </div>
                
                {/* Information notice about status fields */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 mt-0.5">
                      <FiAlertCircle size={18} />
                    </div>
                    <div>
                      <p><strong>Status and Payment Status</strong> fields are managed by the system and cannot be modified directly through this form. Please contact an administrator if changes are needed.</p>
                    </div>
                  </div>
                </div>
                
                {/* Form Buttons with Fancy Styling */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FiX size={18} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-medium transition-colors flex items-center gap-2 shadow-md"
                  >
                    <FiEdit size={18} />
                    Update Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionRequestsTable;