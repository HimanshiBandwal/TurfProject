import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favorites');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile' });
  }
});

// Get user activity (weekly bookings)
router.get('/activity', auth, async (req, res) => {
  try {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    
    const weekDays = eachDayOfInterval({ start, end });
    
    const bookings = await Booking.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          bookings: { $sum: 1 }
        }
      }
    ]);

    const activityData = weekDays.map(day => ({
      day: format(day, 'EEE'),
      date: format(day, 'yyyy-MM-dd'),
      bookings: bookings.find(b => b._id === format(day, 'yyyy-MM-dd'))?.bookings || 0
    }));

    res.json(activityData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity data' });
  }
});

export default router;