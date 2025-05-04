import Pickup from "../models/PickupModel.js";

// @desc   Create a new pickup
// @route  POST /api/pickups
// @access Public (or adjust based on auth setup)
export const createPickup = async (req, res) => {
  try {
    const { dateTime, location, team, teamLeader, instructions } = req.body;

    if (!dateTime || !location || !team || !teamLeader || !instructions) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newPickup = new Pickup({
      dateTime,
      location,
      team,
      teamLeader,
      instructions,
    });

    const savedPickup = await newPickup.save();
    res.status(201).json(savedPickup);
  } catch (error) {
    console.error("Error creating pickup:", error);
    res.status(500).json({ message: "Server error while creating pickup." });
  }
};

// @desc   Get all pickups
// @route  GET /api/pickups
// @access Public
export const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find().sort({ createdAt: -1 });
    res.status(200).json(pickups);
  } catch (error) {
    console.error("Error fetching pickups:", error);
    res.status(500).json({ message: "Server error while fetching pickups." });
  }
};
