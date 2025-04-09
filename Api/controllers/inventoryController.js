import Inventory from '../models/inventoryModel.js';
import { errorHandler } from '../utils/error.js';

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

export const updateInventory = async (req, res, next) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    next(errorHandler(500, 'Failed to update item'));
  }
};

export const deleteInventory = async (req, res, next) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json('Item deleted successfully');
  } catch (err) {
    next(errorHandler(500, 'Failed to delete item'));
  }
};