import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema({
  plastic: { type: Number, default: 0 },
  paper: { type: Number, default: 0 },
  food: { type: Number, default: 0 },
  general: { type: Number, default: 0 },
  recyclable: { type: Number, default: 0 },
});

const logSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  waste: { type: wasteSchema, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
