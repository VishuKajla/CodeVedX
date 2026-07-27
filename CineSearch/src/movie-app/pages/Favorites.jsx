import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-2 mb-8 flex justify-between items-end border-b border-gray-800 pb-4">
        <h2 className="text-3xl font-bold text-white">Your Favorites</h2>
        <span className="text-gray-400 bg-gray-900 px-3 py-1 rounded-full text-sm border border-gray-800">
          {favorites.length} Saved
        </span>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center mt-20 bg-gray-900 border border-gray-800 rounded-3xl p-16 max-w-xl shadow-2xl">
          <div className="text-6xl mb-6 opacity-50">🍿</div>
          <h3 className="text-2xl font-bold text-gray-200 mb-4">No favorites yet!</h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            Go back to the home page, search for a movie you love, and click the heart icon to save it here for later.
          </p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;