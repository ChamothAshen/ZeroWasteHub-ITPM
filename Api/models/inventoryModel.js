import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  weights: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  binSize: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("Inventory", InventorySchema);
