import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './movie-app/pages/Home';
import Favorites from './movie-app/pages/Favorites';
import MovieDetails from './movie-app/pages/MovieDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation Bar */}
      <nav className="w-full p-4 flex justify-between items-center max-w-7xl mx-auto border-b border-gray-800 mb-8">
        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 flex items-center gap-2">
          🍿 CineSearch
        </Link>
        <div className="flex gap-6 font-semibold text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full px-4 max-w-7xl mx-auto pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;