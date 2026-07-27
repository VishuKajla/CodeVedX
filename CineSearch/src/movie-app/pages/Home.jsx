import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import HeroBanner from '../components/HeroBanner';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY; 
      const response = await fetch(
  `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&include_adult=false&region=IN`
);

      if (!response.ok) throw new Error("Failed to fetch movies.");

      const data = await response.json();
      setMovies(data.results); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <HeroBanner />

      <div className="w-full max-w-4xl mb-12 mt-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Find your next favorite movie</h2>
        
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && <p className="text-orange-500 mt-8 animate-pulse text-lg">Searching for movies...</p>}
      {error && <p className="text-red-500 mt-8">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-gray-500 mt-8">No results yet. Try searching for a movie like "Spider-Man".</p>
      )}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;