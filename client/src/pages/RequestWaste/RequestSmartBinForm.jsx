import React, { useState, useEffect } from 'react';

function RequestSmartBinForm({ addBinRequest }) {
  const [formData, setFormData] = useState({
    clientID: '',
    location: '',
    binType: '',
    contactNo: '',
    description: '',
    specialInstructions: '',
    quantity: '1',
    date: '',
    immediate: false
  });

  const clientId = sessionStorage.getItem('clientId') || '';

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        const clientData = await response.json();
        setFormData(prevData => ({
          ...prevData,
          clientID: clientData.id,
          location: `${clientData.addressLatitude}, ${clientData.addressLongitude}`
        }));
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "immediate" && checked) {
      setFormData(prevData => ({ ...prevData, date: "" }));
    }
    if (name === "date" && value) {
      setFormData(prevData => ({ ...prevData, immediate: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (typeof addBinRequest === 'function') {
      addBinRequest(formData);
    }
    
    alert('Smart Bin request submitted successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Request a Smart Bin</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Client ID</label>
            <input type="text" value={formData.clientID} className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600" readOnly />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input type="text" value={formData.location} className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600" readOnly />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bin Type</label>
            <select name="binType" value={formData.binType} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" required>
              <option value="">Select Bin Type</option>
              <option value="plastic">Plastic</option>
              <option value="paper">Paper</option>
              <option value="food">Food</option>
              <option value="general">General Waste</option>
              <option value="recycling">Recycling</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
            <input type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" required />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" rows="3"></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Special Instructions</label>
          <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" rows="2"></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Preferred Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" disabled={formData.immediate} />
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2">
          <input type="checkbox" name="immediate" checked={formData.immediate} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" disabled={formData.date !== ""} />
          <label className="text-gray-700 font-medium">As Soon As Possible</label>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition duration-300">
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default RequestSmartBinForm;
