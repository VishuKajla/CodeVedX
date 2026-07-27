import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
// Check your folder structure: if this file is inside the components folder, use '../pages/'
// If this file is in the main movie-app folder, use './pages/'
import Home from '../pages/Home';
import MovieDetails from '../pages/MovieDetails';
import Favorites from '../pages/Favorites';

const MovieApp = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            🍿 CineSearch
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
};

export default MovieApp;