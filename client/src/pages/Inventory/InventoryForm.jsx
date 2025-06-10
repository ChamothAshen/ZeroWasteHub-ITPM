import { useState} from "react";
import axios from "axios";

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    company: "",
    date: "",
    entries: [{ category: "", binSize: "", quantity: "", weights: "" }],
  });
  const categories = ["Plastic", "Paper", "Food", "General Waste", "Recycling"]; 
  const binSizes = ["Small (120L)","Medium (240L)","Large (360L)","Extra Large (660L)","Commercial (1100L)",];
  
  const handleEntryChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...formData.entries];
    newEntries[index][name] = value;
    setFormData({ ...formData, entries: newEntries });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { category: "", binSize: "", quantity: "", weights: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/Inventory/addInv",
        formData
      );
      setFormData({
        company: "",
        date: "",
        entries: [{ category: "", binSize: "", quantity: "", weights: "" }],
      });
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded">
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      {formData.entries.map((entry, idx) => (
        <div key={idx} className="grid grid-cols-4 gap-2">
          <select
            name="category"
            value={entry.category}
            onChange={(e) => handleEntryChange(idx, e)}
            className="border px-2 py-1 rounded"
            required
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            name="binSize"
            value={entry.binSize}
            onChange={(e) => handleEntryChange(idx, e)}
            className="border px-2 py-1 rounded"
            required
          >
            <option value="">Bin Size</option>
            {binSizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={entry.quantity}
            onChange={(e) => handleEntryChange(idx, e)}
            placeholder="Qty"
            className="border px-2 py-1 rounded"
            required
          />

          <input
            type="number"
            name="weights"
            value={entry.weights}
            onChange={(e) => handleEntryChange(idx, e)}
            placeholder="Weight"
            className="border px-2 py-1 rounded"
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Add Entry
      </button>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Submit Inventory
      </button>
    </form>
  );
};

export default InventoryForm;
