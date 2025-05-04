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
    paymentStatus: '',
    addressLine1: '',
    city: '',
    contactNo: '',
    email: '',
    scheduleDate: '',
    binType: ''
  });

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

//   const handleView = (id) => {
//     console.log('View bin with ID:', id);
//     // Navigate to details page or open modal
//   };

  // FIXED: Removed the duplicate handleEdit function and only kept this one
  const handleEdit = (id) => {
    const binToUpdate = smartBins.find(bin => bin._id === id);
    if (!binToUpdate) return;

    // Prepare form data from the selected bin
    setSelectedBin(binToUpdate);
    
    // Initialize form with current values
    setUpdateFormData({
      status: binToUpdate.status || '',
      paymentStatus: binToUpdate.payment?.paymentStatus || '',
      addressLine1: binToUpdate.address?.addressLine1 || '',
      city: binToUpdate.address?.city || '',
      contactNo: binToUpdate.personalInfo?.contactNo || '',
      email: binToUpdate.personalInfo?.email || '',
      scheduleDate: binToUpdate.schedule?.scheduleDate 
        ? new Date(binToUpdate.schedule.scheduleDate).toISOString().slice(0, 16) 
        : '',
      binType: binToUpdate.binRequest && binToUpdate.binRequest.length > 0 
        ? binToUpdate.binRequest[0].binType 
        : ''
    });
    
    // Show the update form
    setShowUpdateForm(true);
    console.log('Edit form opened for bin with ID:', id);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value
    });
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
          paymentStatus: updateFormData.paymentStatus
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

  const getPaymentStatusBadge = (bin) => {
    if (!bin.payment || !bin.payment.paymentStatus) return null;
    
    const paymentStatus = bin.payment.paymentStatus;
    const paymentColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentColors[paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
        {paymentStatus}
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

      {/* Update Form Modal */}
      {showUpdateForm && selectedBin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Smart Bin Request</h2>
              <button 
                onClick={() => setShowUpdateForm(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateFormSubmit} className="space-y-4">
              {/* Request ID - readonly */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request ID
                </label>
                <input
                  type="text"
                  value={selectedBin.requestId || ""}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              
              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={updateFormData.paymentStatus}
                  onChange={handleUpdateFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Bin Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bin Type
                </label>
                <select
                  name="binType"
                  value={updateFormData.binType}
                  onChange={handleUpdateFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              
              {/* Address */}
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Contact Info */}
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Schedule Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduleDate"
                  value={updateFormData.scheduleDate}
                  onChange={handleUpdateFormChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Payment
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(bin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                      {/* <button 
                        onClick={() => handleView(bin._id)} 
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button> */}
                      <button 
                        onClick={() => handleEdit(bin._id)} 
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100"
                        title="Edit request"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(bin._id)} 
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
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
                {/* Table headers... */}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample rows... */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartBinTable;