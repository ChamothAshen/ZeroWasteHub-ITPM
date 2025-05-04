import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  binSize: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  weights: {
    type: String,
    required: true,
  },
});

const InventorySchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  entries: [EntrySchema], // ⬅️ Multiple entries per company
});

export default mongoose.model("Inventory", InventorySchema);
