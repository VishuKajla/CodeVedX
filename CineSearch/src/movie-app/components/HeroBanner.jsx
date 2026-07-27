import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        // 1. Fetch top English movies
        const engResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=en&sort_by=popularity.desc`);
        const engData = await engResponse.json();
        const engMovies = engData.results;

        // 2. Fetch top Hindi movies
        const hinResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=hi&sort_by=popularity.desc`);
        const hinData = await hinResponse.json();
        const hinMovies = hinData.results;

        // 3. Weave them together
        const mixedMovies = [];
        const maxLength = Math.max(engMovies.length, hinMovies.length);

        for (let i = 0; i < maxLength; i += 2) {
          if (engMovies[i]) mixedMovies.push(engMovies[i]);
          if (engMovies[i + 1]) mixedMovies.push(engMovies[i + 1]);
          if (hinMovies[i]) mixedMovies.push(hinMovies[i]);
          if (hinMovies[i + 1]) mixedMovies.push(hinMovies[i + 1]);
        }
        
        setMovies(mixedMovies);

        // THE FIX: We brought back the random math so it doesn't always start at 0!
        const randomStartIndex = Math.floor(Math.random() * mixedMovies.length);
        setCurrentIndex(randomStartIndex);
        
      } catch (error) {
        console.error("Failed to fetch trending movies for banner", error);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 10000); 

    return () => clearInterval(timer);
  }, [movies.length]); 

  if (movies.length === 0) return <div className="w-full h-[60vh] bg-gray-900 rounded-3xl animate-pulse mb-12"></div>;

  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="relative w-full h-[60vh] rounded-3xl overflow-hidden mb-12 flex flex-col justify-end shadow-2xl transition-all duration-700 ease-in-out"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
      
      <div className="relative z-10 p-8 md:p-12 w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
          {currentMovie.title}
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 line-clamp-3 drop-shadow-md">
          {currentMovie.overview}
        </p>
        
        <div className="flex gap-4">
          <Link 
            to={`/movie/${currentMovie.id}`}
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 shadow-lg hover:scale-105 transform duration-200"
          >
            ▶ Play
          </Link>
          <Link 
            to={`/movie/${currentMovie.id}`}
            className="px-6 py-3 bg-gray-500/50 text-white font-bold rounded-lg hover:bg-gray-500/70 transition-colors flex items-center gap-2 backdrop-blur-md shadow-lg hover:scale-105 transform duration-200"
          >
            ℹ More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;