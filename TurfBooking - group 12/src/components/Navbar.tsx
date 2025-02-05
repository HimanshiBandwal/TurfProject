import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, User, Heart, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">TurfBook</h1>
          </Link>

          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <Heart size={20} />
                  <span>Favorites</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}