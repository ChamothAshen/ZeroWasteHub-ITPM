import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateInventoryForm = () => {
  const { id } = useParams(); // Get inventory ID from URL
  const [formData, setFormData] = useState({
    company: "",
    category: "",
    weights: "",
    quantity: "",
    binSize: "",
    date: "",
  });

  useEffect(() => {
    // Fetch existing inventory data
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/inventory/getInv/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/inventory/editInv/${id}`, formData);
      alert("Inventory updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating inventory.");
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
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Weights</label>
        <input
          type="text"
          name="weights"
          value={formData.weights}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Bin Size</label>
        <input
          type="text"
          name="binSize"
          value={formData.binSize}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date?.split("T")[0] || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

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
