import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { turfs } from '../data/turfs';
import SearchBar from '../components/SearchBar';
import TurfCard from '../components/TurfCard';
import TurfDetails from '../components/TurfDetails';
import AnimatedCard from '../components/AnimatedCard';
import type { SearchFilters, Turf } from '../types';

export default function Home() {
  const { user, addToFavorites, removeFromFavorites } = useAuth();
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>(turfs);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    const filtered = turfs.filter((turf) => {
      const locationMatch = turf.location.toLowerCase().includes(filters.location.toLowerCase());
      const sportMatch = !filters.sport || turf.sport === filters.sport;
      return locationMatch && sportMatch;
    });
    setFilteredTurfs(filtered);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Find and Book Sports Turfs
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Just be PlayAble Jagah Toh Milhi Jayege!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SearchBar onSearch={handleSearch} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredTurfs.map((turf, index) => (
          <AnimatedCard key={turf.id} index={index}>
            <TurfCard
              turf={turf}
              onBook={() => setSelectedTurf(turf)}
              onToggleFavorite={() => {
                if (user?.favorites.includes(turf.id)) {
                  removeFromFavorites(turf.id);
                } else {
                  addToFavorites(turf.id);
                }
              }}
              isFavorite={user?.favorites.includes(turf.id)}
            />
          </AnimatedCard>
        ))}
      </div>

      {selectedTurf && (
        <TurfDetails
          turf={selectedTurf}
          onClose={() => setSelectedTurf(null)}
        />
      )}
    </main>
  );
}