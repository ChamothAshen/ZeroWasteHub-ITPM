import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, X } from 'lucide-react';

const SmartBinTable = () => {
  const [smartBins, setSmartBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for update form
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    status: '',
    price: '', // Added price field
    addressLine1: '',
    city: '',
    contactNo: '',
    email: '',
    scheduleDate: '',
    binType: ''
  });
  
  // Pricing table for different bin types
  const binPrices = {
    general: 1500,
    recycling: 2000,
    compost: 2500,
    paper: 1800,
    glass: 2200,
    plastic: 2000,
    metal: 2300,
    electronics: 3000,
    hazardous: 4000
  };

  useEffect(() => {
    const fetchSmartBins = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/BinRequest/smartbins');
        
        if (!response.ok) {
          throw new Error('Failed to fetch smart bin data');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setSmartBins(data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching smart bins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSmartBins();
  }, []);

  const handleEdit = (id) => {
    const binToUpdate = smartBins.find(bin => bin._id === id);
    if (!binToUpdate) return;

    // Prepare form data from the selected bin
    setSelectedBin(binToUpdate);

    // Get bin type for price calculation
    const binType = binToUpdate.binRequest && binToUpdate.binRequest.length > 0 
      ? binToUpdate.binRequest[0].binType 
      : '';
    
    // Get current price or calculate based on bin type
    const currentPrice = binToUpdate.payment?.price || (binType ? binPrices[binType.toLowerCase()] || 0 : 0);

    // Initialize form with current values
    setUpdateFormData({
      status: binToUpdate.status || '',
      price: currentPrice.toString(), // Convert to string for form input
      addressLine1: binToUpdate.address?.addressLine1 || '',
      city: binToUpdate.address?.city || '',
      contactNo: binToUpdate.personalInfo?.contactNo || '',
      email: binToUpdate.personalInfo?.email || '',
      scheduleDate: binToUpdate.schedule?.scheduleDate 
        ? new Date(binToUpdate.schedule.scheduleDate).toISOString().slice(0, 16) 
        : '',
      binType: binType
    });

    // Show the update form
    setShowUpdateForm(true);
    console.log('Edit form opened for bin with ID:', id);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    
    // If bin type is changing, update the price based on the selected bin type
    if (name === 'binType' && value) {
      const newPrice = binPrices[value.toLowerCase()] || 0;
      
      setUpdateFormData({
        ...updateFormData,
        [name]: value,
        price: newPrice.toString()
      });
    } else {
      setUpdateFormData({
        ...updateFormData,
        [name]: value
      });
    }
  };

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBin) return;

    try {
      // Prepare the updated bin data
      const updatedBin = {
        ...selectedBin,
        status: updateFormData.status,
        address: {
          ...selectedBin.address,
          addressLine1: updateFormData.addressLine1,
          city: updateFormData.city
        },
        personalInfo: {
          ...selectedBin.personalInfo,
          contactNo: updateFormData.contactNo,
          email: updateFormData.email
        },
        payment: {
          ...selectedBin.payment,
          price: parseFloat(updateFormData.price) || 0 // Add price to payment object
        },
        schedule: {
          ...selectedBin.schedule,
          scheduleDate: updateFormData.scheduleDate
        }
      };
      
      // Update binRequest only if binType is changed
      if (updateFormData.binType && selectedBin.binRequest && selectedBin.binRequest.length > 0) {
        updatedBin.binRequest = [
          {
            ...selectedBin.binRequest[0],
            binType: updateFormData.binType
          },
          ...selectedBin.binRequest.slice(1)
        ];
      }
      
      console.log('Sending update request for bin:', selectedBin._id);
      console.log('Update data:', updatedBin);
      
      // Send the update request
      const response = await fetch(`/api/BinRequest/smartbins/${selectedBin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBin)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update smart bin request');
      }
      
      const result = await response.json();
      console.log('Update successful, response:', result);
      
      // Update the local state
      setSmartBins(smartBins.map(bin => 
        bin._id === selectedBin._id ? result.data : bin
      ));
      
      // Close the form and reset selected bin
      setShowUpdateForm(false);
      setSelectedBin(null);
      
      alert('Smart bin request updated successfully');
    } catch (err) {
      console.error('Error updating smart bin:', err);
      alert('Failed to update smart bin request: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this smart bin request?')) {
      try {
        console.log('Deleting bin with ID:', id);
        // Updated endpoint to match the route defined in your router file
        const response = await fetch(`/api/BinRequest/smartbins/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete smart bin request');
        }

        // Remove from state
        setSmartBins(smartBins.filter(bin => bin._id !== id));
        alert('Smart bin request deleted successfully');
      } catch (err) {
        console.error('Error deleting smart bin:', err);
        alert('Failed to delete smart bin request: ' + err.message);
      }
    }
  };

  const getBinTypeIcon = (binType) => {
    // Return appropriate emoji based on bin type
    switch (binType?.toLowerCase()) {
      case 'general':
        return '🗑️';
      case 'recycling':
        return '♻️';
      case 'compost':
        return '🌱';
      case 'paper':
        return '📄';
      case 'glass':
        return '🥛';
      case 'plastic':
        return '🥤';
      case 'metal':
        return '🥫';
      case 'electronics':
        return '📱';
      case 'hazardous':
        return '⚠️';
      default:
        return '🗑️';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';

    try {
      const date = new Date(dateString);
      return (
        <>
          {date.toLocaleDateString()}
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </>
      );
    } catch (e) {
      return dateString;
    }
  };

  const formatAddress = (bin) => {
    if (!bin.address) return '—';

    const { addressLine1, city } = bin.address;
    return addressLine1 && city ? `${addressLine1}, ${city}` : addressLine1 || city || '—';
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getContactInfo = (bin) => {
    if (!bin.personalInfo) return '—';
    return bin.personalInfo.contactNo || bin.personalInfo.email || '—';
  };

  const getScheduleDate = (bin) => {
    if (!bin.schedule) return '—';
    return formatDate(bin.schedule.scheduleDate);
  };

  const getBinType = (bin) => {
    if (!bin.binRequest || !bin.binRequest.length) return '—';

    // Get the first bin type for display, more complex logic could be added
    const firstBin = bin.binRequest[0];
    return (
      <div className="flex items-center">
        <span className="mr-2">{getBinTypeIcon(firstBin.binType)}</span>
        <span>{firstBin.binType}</span>
      </div>
    );
  };

  // Format the price for display
  const formatPrice = (bin) => {
    if (!bin.payment || bin.payment.price === undefined) {
      // If no price in payment, calculate based on bin type
      if (bin.binRequest && bin.binRequest.length > 0) {
        const binType = bin.binRequest[0].binType?.toLowerCase();
        if (binType && binPrices[binType]) {
          return `Rs. ${binPrices[binType].toLocaleString()}`;
        }
      }
      return '—';
    }
    return `Rs. ${bin.payment.price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-green-500 border-r-transparent"></div>
        <span className="ml-2">Loading smart bins...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          <h3 className="text-lg font-medium">Error loading smart bins</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Smart Bin Requests</h1>
      </div>

      {/* Enhanced Update Form Modal */}
      {showUpdateForm && selectedBin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-green-700">Update Smart Bin Request</h2>
              <button 
                onClick={() => setShowUpdateForm(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateFormSubmit} className="space-y-6">
              {/* Request ID section - Made read-only and styled differently */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Information</h3>
                <div className="flex items-center">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Request ID 
                    </label>
                    <input
                      type="text"
                      value={selectedBin.requestId || `ID-${selectedBin._id?.slice(0, 8)}`}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              {/* Main form content divided into sections */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Request Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={updateFormData.status}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  
                </div>
              </div>

              {/* Bin Information */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Bin Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bin Type
                    </label>
                    <select
                      name="binType"
                      value={updateFormData.binType}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Bin Type</option>
                      <option value="general">General</option>
                      <option value="recycling">Recycling</option>
                      <option value="compost">Compost</option>
                      <option value="paper">Paper</option>
                      <option value="glass">Glass</option>
                      <option value="plastic">Plastic</option>
                      <option value="metal">Metal</option>
                      <option value="electronics">Electronics</option>
                      <option value="hazardous">Hazardous</option>
                    </select>
                  </div>
                  
                  {/* Added Price Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={updateFormData.price}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default price based on bin type will be automatically calculated
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Location Information */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={updateFormData.addressLine1}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={updateFormData.city}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNo"
                      value={updateFormData.contactNo}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updateFormData.email}
                      onChange={handleUpdateFormChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              {/* Schedule Information */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Schedule Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduleDate"
                    value={updateFormData.scheduleDate}
                    onChange={handleUpdateFormChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Request ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Waste Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Schedule Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Status
                </th>
                {/* Added Price Column */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {smartBins.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No smart bin requests found
                  </td>
                </tr>
              ) : (
                smartBins.map((bin, index) => (
                  <tr key={bin._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bin.requestId || `ID-${bin._id?.slice(0, 8) || index}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getBinType(bin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(bin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getScheduleDate(bin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getContactInfo(bin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(bin.status)}
                    </td>
                    {/* Added Price Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(bin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                      <button 
                        onClick={() => handleEdit(bin._id)} 
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                        title="Edit request"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(bin._id)} 
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete request"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample data for demo purposes */}
      {smartBins.length === 0 && (
        <div className="mt-10 bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Sample Demo Data</h2>
          <p className="mb-4 text-gray-600">No data found from API. Here's a preview of how the table would look with sample data:</p>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Waste Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    BIN-001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">♻️</span>
                      <span>Recycling</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    123 Green St, Colombo
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs. 2,000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    BIN-002
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">🥫</span>
                      <span>Metal</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    456 Clean Ave, Negombo
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rs. 2,300
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartBinTable;