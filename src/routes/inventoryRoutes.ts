import express from 'express';
import Inventory from '../models/Inventory';
import { INITIAL_INVENTORY } from '../data';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let items = await Inventory.find({});
    if (items.length === 0) {
      items = await Inventory.insertMany(INITIAL_INVENTORY);
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.put('/', async (req, res) => {
  try {
    const items = req.body as Array<any>;
    await Inventory.deleteMany({});
    await Inventory.insertMany(items);
    res.json({ message: 'Inventory updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

export default router;