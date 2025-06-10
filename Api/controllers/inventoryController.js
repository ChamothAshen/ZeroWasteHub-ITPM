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

export const deleteEntry = async (req, res) => {
  const { companyId, entryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId) || !mongoose.Types.ObjectId.isValid(entryId)) {
    return res.status(400).json({ message: "Invalid company or entry ID" });
  }

  try {
    const company = await Inventory.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const originalLength = company.entries.length;
    company.entries = company.entries.filter(entry => entry._id.toString() !== entryId);

    if (company.entries.length === originalLength) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await company.save();
    res.status(200).json({ message: "Entry deleted successfully", updatedCompany: company });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Server error", error });
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
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $unwind: "$entries",
      },
      {
        $group: {
          _id: "$entries.category",
          totalWeight: {
            $sum: {
              $toDouble: "$entries.weights",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalWeight: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Today's weight by category",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching today's category weights: ${err.message}`,
    });
  }
};

export const getMonthlyWeight = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await Inventory.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $unwind: "$entries",
      },
      {
        $group: {
          _id: "$entries.category",
          totalWeight: {
            $sum: {
              $toDouble: "$entries.weights",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalWeight: 1,
        },
      },
    ]);

    const month = today.toLocaleString('default', { month: 'long' });

    res.status(200).json({
      success: true,
      message: `Weight by category for ${month}`,
      month: month,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching this month's category weights: ${err.message}`,
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

export const getAllMonthsWeight = async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $unwind: "$entries", // Break down entries into individual documents
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            category: "$entries.category",
          },
          totalWeight: {
            $sum: {
              $toDouble: "$entries.weights", // Sum up weights for each category per month
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          categories: {
            $push: {
              category: "$_id.category",
              totalWeight: "$totalWeight",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          categories: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 }, // Sort by year and month
      },
    ]);

    // Add month names to the result
    const formattedResult = result.map((item) => {
      const monthName = new Date(item.year, item.month - 1).toLocaleString("default", {
        month: "long",
      });
      return {
        ...item,
        monthName,
      };
    });

    res.status(200).json({
      success: true,
      message: "Weight by category for all months",
      data: formattedResult,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching weights by category for all months: ${err.message}`,
    });
  }
};





