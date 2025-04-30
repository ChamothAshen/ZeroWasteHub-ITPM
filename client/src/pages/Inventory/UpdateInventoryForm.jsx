import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const UpdateInventoryForm = () => {
  const { id } = useParams(); // Get inventory ID from URL
  const [formData, setFormData] = useState({
    company: "",
    date: "",
    entries: [], // Add entries as an array
  });
  const navigate = useNavigate(); // For navigation after update


  useEffect(() => {
    // Fetch the inventory item to update by ID
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/Inventory/getInv/${id}`);
        setFormData({
          company: res.data.company,
          date: new Date(res.data.date).toISOString().split('T')[0], // Format date
          entries: res.data.entries, // Set the entries data
        });
      } catch (error) {
        console.error("Failed to fetch inventory item:", error);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEntries = [...formData.entries];
    updatedEntries[index][name] = value; // Update specific entry
    setFormData({ ...formData, entries: updatedEntries });
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/Inventory/editInv/${id}`, formData);
      // After updating, navigate back to the inventory page or wherever
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  return (
      <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Update Inventory</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleGeneralChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleGeneralChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      
      {formData.entries.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-lg font-semibold">Entry {idx + 1}</h4>
              <input
                type="text"
                name="category"
                value={entry.category}
                onChange={(e) => handleChange(e, idx)}
                placeholder="Category"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="weights"
                value={entry.weights}
                onChange={(e) => handleChange(e, idx)}
                placeholder="Weights"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="quantity"
                value={entry.quantity}
                onChange={(e) => handleChange(e, idx)}
                placeholder="Quantity"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="binSize"
                value={entry.binSize}
                onChange={(e) => handleChange(e, idx)}
                placeholder="Bin Size"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Update Inventory
      </button>
    </form>
   
  );
};

export default UpdateInventoryForm;
