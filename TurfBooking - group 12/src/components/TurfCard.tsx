import React from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Turf } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AnimatedButton from './AnimatedButton';

interface TurfCardProps {
  turf: Turf;
  onBook: (turfId: string) => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export default function TurfCard({ turf, onBook, onToggleFavorite, isFavorite }: TurfCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book a turf');
      navigate('/login');
      return;
    }
    onBook(turf.id);
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      navigate('/login');
      return;
    }
    onToggleFavorite?.();
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden group h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <motion.img
          src={turf.image}
          alt={turf.name}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {onToggleFavorite && (
          <AnimatedButton
            onClick={handleFavorite}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </AnimatedButton>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{turf.name}</h3>
          <motion.div
            className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="text-yellow-400" size={16} />
            <span className="text-sm font-medium">{turf.rating}</span>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin size={16} />
          <span className="text-sm">{turf.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {turf.amenities.map((amenity) => (
            <motion.span
              key={amenity}
              className="text-xs bg-gray-100 px-2 py-1 rounded"
              whileHover={{ scale: 1.05, backgroundColor: '#E5E7EB' }}
            >
              {amenity}
            </motion.span>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <p className="text-lg font-bold">₹{turf.price}/hr</p>
          </div>
          
          <AnimatedButton
            onClick={handleBooking}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Book Now
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}