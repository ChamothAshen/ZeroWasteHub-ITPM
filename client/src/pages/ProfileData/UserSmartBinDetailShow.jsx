import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const SmartBinTable = () => {
  const [smartBins, setSmartBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleView = (id) => {
    console.log('View bin with ID:', id);
    // Navigate to details page or open modal
  };

  const handleEdit = (id) => {
    console.log('Edit bin with ID:', id);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this smart bin request?')) {
      try {
        const response = await fetch(`/api/BinRequest/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete smart bin request');
        }

        // Remove from state
        setSmartBins(smartBins.filter(bin => bin._id !== id));
      } catch (err) {
        console.error('Error deleting smart bin:', err);
        alert('Failed to delete smart bin request');
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
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    SBR-F57940D
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">🗑️</span>
                      <span>general</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3/218
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>3/22/2025</div>
                    <div className="text-xs text-gray-500">05:30 AM</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    0713365616
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                      <Eye size={18} />
                    </button>
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
                    SBR-BB5820D
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">♻️</span>
                      <span>recycling</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    123 Green Street, Eco City
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>4/5/2025</div>
                    <div className="text-xs text-gray-500">05:30 AM</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    555-123-4567
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                      <Eye size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    SBR-D49E05D
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">🌱</span>
                      <span>compost</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    vdsfs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>4/27/2025</div>
                    <div className="text-xs text-gray-500">05:30 AM</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    535356
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                      <Eye size={18} />
                    </button>
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