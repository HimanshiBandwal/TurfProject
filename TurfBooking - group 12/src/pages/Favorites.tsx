import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TurfCard from '../components/TurfCard';
import { turfs } from '../data/turfs';

export default function Favorites() {
  const { user, removeFromFavorites } = useAuth();

  if (!user) {
    return null;
  }

  const favoriteTurfs = turfs.filter((turf) => user.favorites.includes(turf.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Favorite Turfs</h2>
      {favoriteTurfs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't added any turfs to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteTurfs.map((turf) => (
            <TurfCard
              key={turf.id}
              turf={turf}
              onBook={() => {}}
              onRemoveFavorite={() => removeFromFavorites(turf.id)}
              isFavorite
            />
          ))}
        </div>
      )}
    </div>
  );
}