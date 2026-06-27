import express from 'express';
import Notification from '../models/Notification';
import { INITIAL_NOTIFICATIONS } from '../data';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let notifications = await Notification.find({}).sort({ timestamp: -1 });
    if (notifications.length === 0) {
      notifications = await Notification.insertMany(INITIAL_NOTIFICATIONS);
    }
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.put('/', async (req, res) => {
  try {
    const notifications = req.body as Array<any>;
    await Notification.deleteMany({});
    await Notification.insertMany(notifications);
    res.json({ message: 'Notifications updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

export default router;