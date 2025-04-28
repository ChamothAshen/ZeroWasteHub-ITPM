import Inventory from '../models/inventoryModel.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

export const createInventory = async (req, res, next) => {
  try {
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    next(errorHandler(500, 'Failed to create item'));
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (err) {
    next(errorHandler(500, 'Failed to fetch items'));
  }
};

export const getInventoryById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    next(err); // or handle the error as per your setup
  }
};


export const updateInventory = async (req, res, next) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    next(errorHandler(500, 'Failed to update item'));
  }
};

/* export const deleteInventory = async (req, res, next) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json('Item deleted successfully');
  } catch (err) {
    next(errorHandler(500, 'Failed to delete item'));
  }
};
 */


export const deleteInventory = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, 'Invalid item ID'));
    }

    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return next(errorHandler(404, 'Item not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: deletedItem
    });
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    next(errorHandler(500, 'Failed to delete item'));
  }
};

export const getTodayWeight = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const result = await Inventory.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: "$category",
          totalWeight: { $sum: { $toDouble: "$weights" } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Today's weight by category",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching today's category weights: ${err.message}`
    });
  }
};
export const getTodayInventory = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const result = await Inventory.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: "$category",
          totalWeight: { $sum: { $toDouble: "$weights" } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Today's weight by category",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching today's category weights: ${err.message}`
    });
  }
};





