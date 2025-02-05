import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Activity, CreditCard } from 'lucide-react';
import { BarChart, Card, Title } from '@tremor/react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings, getUserActivity, type Booking, type ActivityData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setError(null);
        const [bookingsData, activity] = await Promise.all([
          getUserBookings(),
          getUserActivity()
        ]);
        
        if (isMounted) {
          setBookings(bookingsData);
          setActivityData(activity);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load profile data. Please try again later.');
          console.error('Error fetching user data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <Title>Weekly Activity</Title>
            {activityData.length > 0 ? (
              <BarChart
                className="mt-4 h-48"
                data={activityData}
                index="day"
                categories={["bookings"]}
                colors={["blue"]}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No activity data available</p>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activityData.length > 0 ? (
              activityData.slice(-3).map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span>{activity.day}: {activity.bookings} bookings</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CreditCard size={20} className="text-blue-600" />
          Payment History
        </h3>
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{booking.turf.name}</h4>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <MapPin size={16} />
                      <span className="text-sm">{booking.turf.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <Calendar size={16} />
                      <span className="text-sm">
                        {format(new Date(booking.date), 'PPP')} at {booking.timeSlot}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">₹{booking.price}</span>
                    <p className="text-sm text-gray-500">
                      {format(new Date(booking.createdAt), 'PP')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No booking history available</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}