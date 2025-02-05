import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Card, Title, Text } from '@tremor/react';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { getAdminStats, getBookingAnalytics } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, analyticsData] = await Promise.all([
          getAdminStats(),
          getBookingAnalytics()
        ]);
        setStats(statsData);
        setBookingData(analyticsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { title: 'Total Bookings', value: stats?.totalBookings, icon: Calendar, color: 'blue' },
    { title: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'green' },
    { title: 'Revenue', value: `₹${stats?.totalRevenue}`, icon: DollarSign, color: 'purple' },
    { title: 'Growth', value: `${stats?.growth}%`, icon: TrendingUp, color: 'orange' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <div>
                  <Text>{stat.title}</Text>
                  <Title className="text-2xl font-bold">{stat.value}</Title>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <Title>Booking Trends</Title>
          <BarChart
            className="mt-4 h-80"
            data={bookingData}
            index="date"
            categories={["bookings"]}
            colors={["blue"]}
          />
        </Card>
      </motion.div>
    </div>
  );
}