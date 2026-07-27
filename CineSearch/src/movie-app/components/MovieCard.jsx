import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
    const isSaved = savedFavorites.some(fav => fav.id === movie.id);
    setIsFavorite(isSaved);
  }, [movie.id]);

  const toggleFavorite = (e) => {
    e.preventDefault(); 
    let savedFavorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
    
    if (isFavorite) {
      savedFavorites = savedFavorites.filter(fav => fav.id !== movie.id);
    } else {
      savedFavorites.push(movie);
    }
    
    localStorage.setItem('movieFavorites', JSON.stringify(savedFavorites));
    setIsFavorite(!isFavorite); 
  };

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const posterUrl = movie.poster_path 
    ? `${IMAGE_BASE_URL}${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Poster';

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col group cursor-pointer block relative border border-gray-800"
    >
      <button 
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 p-2 bg-gray-950/80 backdrop-blur-md rounded-full hover:scale-110 transition-transform shadow-lg"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      <img 
        src={posterUrl} 
        alt={movie.title || "Movie Poster"}
        className="w-full h-[350px] object-cover"
      />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-orange-500 transition-colors" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
          <span className="bg-gray-800 px-2 py-1 rounded-md text-orange-400 font-semibold border border-gray-700">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
          </span>
          <span>{movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;