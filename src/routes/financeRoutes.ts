import express from 'express';
import Finance from '../models/Finance';
import { INITIAL_FINANCE } from '../data';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let finance = await Finance.findOne({});
    if (!finance) {
      finance = await Finance.create(INITIAL_FINANCE);
    }
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finance stats' });
  }
});

router.put('/', async (req, res) => {
  try {
    const finance = await Finance.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update finance stats' });
  }
});

export default router;