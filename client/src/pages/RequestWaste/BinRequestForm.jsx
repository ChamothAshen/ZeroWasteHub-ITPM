import React, { useState } from "react";

const BinRequestForm = ({ formData, handleChange, handleBinRequestChange }) => {
  const [binType, setBinType] = useState("");
  const [binSize, setBinSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  const handleBinRequestSubmit = () => {
    const newBinRequest = [
      {
        binType: binType,
        binSize: binSize,
        quantity: quantity,
        description: description,
      },
    ];

    // Pass the new bin request to the parent
    handleBinRequestChange(newBinRequest);

    // Reset the fields after submission (optional)
    setBinType("");
    setBinSize("");
    setQuantity(1);
    setDescription("");
  };
  const binTypeIcons = {
    general: "🗑️",
    recycling: "♻️",
    compost: "🌱",
    paper: "📄",
    glass: "🥛",
    plastic: "🧴",
    metal: "🥫",
    electronics: "💻",
    hazardous: "⚠️",
    construction: "🏗️",
    medical: "🩺",
  };

  return (
    <div className="border-b border-green-100 pb-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">🗑️</span> Bin Request Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="binType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Waste Type
          </label>
          <select
            id="binType"
            name="binType"
            value={binType}
            onChange={(e) => setBinType(e.target.value)}
            className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
          >
            <option value="">Select Waste Type</option>
            <option value="general">
              {binTypeIcons.general} General Waste
            </option>
            <option value="recycling">
              {binTypeIcons.recycling} Recycling
            </option>
            <option value="compost">
              {binTypeIcons.compost} Organic Waste
            </option>
            <option value="paper">{binTypeIcons.paper} Paper/Cardboard</option>
            <option value="glass">{binTypeIcons.glass} Glass</option>
            <option value="plastic">{binTypeIcons.plastic} Plastic</option>
            <option value="metal">{binTypeIcons.metal} Metal</option>
            <option value="electronics">
              {binTypeIcons.electronics} Electronic Waste
            </option>
            <option value="hazardous">
              {binTypeIcons.hazardous} Hazardous Waste
            </option>
            <option value="construction">
              {binTypeIcons.construction} Construction/Demolition
            </option>
            <option value="medical">
              {binTypeIcons.medical} Medical Waste
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="binSize"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bin Size
          </label>
          <select
            id="binSize"
            name="binSize"
            value={binSize}
            onChange={(e) => setBinSize(e.target.value)}
            className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
            required
          >
            <option value="small">Select Bin Size </option>
            <option value="small">Small (120L)</option>
            <option value="medium">Medium (240L)</option>
            <option value="large">Large (360L)</option>
            <option value="xlarge">Extra Large (660L)</option>
            <option value="commercial">Commercial (1100L)</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantity
          </label>
          <select
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Waste Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of waste materials"
            className="w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3"
          />
        </div>
      </div>

      {/* Button to add the bin request */}
      <button
        type="button"
        onClick={handleBinRequestSubmit}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Add Bin Request
      </button>
    </div>
  );
};

export default BinRequestForm;
