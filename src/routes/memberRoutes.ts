import express from 'express';
import Member from '../models/Member';
import { INITIAL_MEMBERS } from '../data';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let members = await Member.find({});
    if (members.length === 0) {
      members = await Member.insertMany(INITIAL_MEMBERS);
    }
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.id) {
      data.id = `#IP-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    const newMember = await Member.create(data);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create member' });
  }
});

router.post('/checkin', async (req, res) => {
  try {
    const { query } = req.body;
    const member = await Member.findOne({
      $or: [
        { id: query.toLowerCase() },
        { name: { $regex: query, $options: 'i' } }
      ]
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    member.absentDays = 0;
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Check-in failed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Member.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

export default router;