import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Clock, MapPin, Star } from 'lucide-react';
import type { Turf } from '../types';
import AnimatedButton from './AnimatedButton';

interface TurfDetailsProps {
  turf: Turf;
  onClose: () => void;
}

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

export default function TurfDetails({ turf, onClose }: TurfDetailsProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('');

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    
    // Here you would typically integrate with a payment gateway
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative">
            <AnimatedButton
              onClick={onClose}
              className="absolute right-4 top-4 z-10 bg-white rounded-full p-2 shadow-lg"
            >
              <X size={20} />
            </AnimatedButton>
            
            <motion.img
              src={turf.image}
              alt={turf.name}
              className="w-full h-64 object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-start mb-4"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{turf.name}</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{turf.location}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400" size={20} />
                <span className="font-semibold">{turf.rating}</span>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {turf.amenities.map((amenity, index) => (
                    <motion.span
                      key={amenity}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, backgroundColor: '#E5E7EB' }}
                    >
                      {amenity}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold mb-3">Booking Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time, index) => (
                        <motion.button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            selectedTime === time
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.02 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-6 pt-6 border-t"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Price per hour</p>
                  <p className="text-2xl font-bold">₹{turf.price}</p>
                </div>
                
                <AnimatedButton
                  onClick={handleBooking}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}