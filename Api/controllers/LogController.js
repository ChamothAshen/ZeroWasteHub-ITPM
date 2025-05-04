import Log from "../models/LogModel.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addLog = async (req, res) => {
  const { date, location, waste, status } = req.body;
  try {
    const newLog = new Log({ date, location, waste, status });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateLog = async (req, res) => {
  try {
    const updatedLog = await Log.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteLog = async (req, res) => {
  try {
    await Log.findByIdAndDelete(req.params.id);
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};