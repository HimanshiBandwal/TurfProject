import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Turf from '../models/Turf.js';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    // Calculate month-over-month growth
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);

    const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            status: 'confirmed',
            createdAt: {
              $gte: startOfMonth(currentMonth),
              $lte: endOfMonth(currentMonth)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]),
      Booking.aggregate([
        {
          $match: {
            status: 'confirmed',
            createdAt: {
              $gte: startOfMonth(lastMonth),
              $lte: endOfMonth(lastMonth)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ])
    ]);

    const growth = lastMonthRevenue[0]?.total
      ? ((currentMonthRevenue[0]?.total - lastMonthRevenue[0]?.total) / lastMonthRevenue[0]?.total) * 100
      : 0;

    res.json({
      totalBookings,
      totalUsers,
      totalRevenue: totalRevenue[0]?.total || 0,
      growth: Math.round(growth * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// Get booking analytics
router.get('/analytics/bookings', isAdmin, async (req, res) => {
  try {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookings: { $sum: 1 }
        }
      }
    ]);

    const bookingData = last30Days.map(date => ({
      date,
      bookings: bookings.find(b => b._id === date)?.bookings || 0
    }));

    res.json(bookingData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking analytics' });
  }
});

// Get revenue analytics
router.get('/analytics/revenue', isAdmin, async (req, res) => {
  try {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return format(date, 'yyyy-MM');
    }).reverse();

    const revenue = await Booking.aggregate([
      {
        $match: { status: 'confirmed' }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$price' }
        }
      }
    ]);

    const revenueData = last6Months.map(month => ({
      month,
      revenue: revenue.find(r => r._id === month)?.revenue || 0
    }));

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue analytics' });
  }
});

// Get user analytics
router.get('/analytics/users', isAdmin, async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'user',
          as: 'bookings'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          bookingCount: { $size: '$bookings' },
          totalSpent: {
            $sum: '$bookings.price'
          }
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user analytics' });
  }
});

// Get turf analytics
router.get('/analytics/turfs', isAdmin, async (req, res) => {
  try {
    const turfStats = await Turf.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'turf',
          as: 'bookings'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          bookingCount: { $size: '$bookings' },
          revenue: {
            $sum: '$bookings.price'
          },
          rating: 1
        }
      },
      {
        $sort: { bookingCount: -1 }
      }
    ]);

    res.json(turfStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching turf analytics' });
  }
});

export default router;