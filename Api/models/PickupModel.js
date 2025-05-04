import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema({
  dateTime: { type: Date, required: true },
  location: { type: String, required: true },
  team: { type: String, required: true },
  teamLeader: { type: String, required: true },
  instructions: { type: String, required: true },
}, { timestamps: true });

const Pickup = mongoose.model("Pickup", pickupSchema);
export default Pickup; // ✅ Add this
