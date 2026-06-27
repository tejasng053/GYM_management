import express from 'express';
import Trainer from '../models/Trainer';
import { INITIAL_TRAINERS } from '../data';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let trainers = await Trainer.find({});
    if (trainers.length === 0) {
      trainers = await Trainer.insertMany(INITIAL_TRAINERS);
    }
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trainers' });
  }
});

router.put('/', async (req, res) => {
  try {
    const trainers = req.body as Array<any>;
    for (const t of trainers) {
      await Trainer.findOneAndUpdate({ id: t.id }, t, { new: true, upsert: true });
    }
    res.json({ message: 'Trainers updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trainers' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTrainer = await Trainer.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updatedTrainer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trainer' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTrainer = await Trainer.create(req.body);
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trainer' });
  }
});

export default router;