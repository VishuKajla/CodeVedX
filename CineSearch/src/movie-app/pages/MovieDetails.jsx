import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos`);
        
        if (!response.ok) throw new Error("Failed to fetch movie details.");
        
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div className="text-center text-white mt-20 text-2xl animate-pulse">Loading movie details...</div>;
  if (error) return <div className="text-center text-red-500 mt-20 text-xl">{error}</div>;
  if (!movie) return null;

  const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const trailer = movie.videos?.results?.find(vid => vid.site === "YouTube" && vid.type === "Trailer");

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-semibold">
          <span>&larr;</span> Back to Search
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-10 bg-gray-900 rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-800">
        
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img 
            src={movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Poster'} 
            alt={movie.title}
            className="w-full rounded-2xl shadow-lg border border-gray-800"
          />
        </div>

        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{movie.title}</h1>
          {movie.tagline && <p className="text-orange-400 text-lg mb-6 italic">"{movie.tagline}"</p>}
          
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-gray-800 px-4 py-1.5 rounded-lg text-orange-400 font-bold border border-gray-700">
              ⭐ {movie.vote_average?.toFixed(1)} / 10
            </span>
            <span className="bg-gray-800 px-4 py-1.5 rounded-lg text-gray-300 border border-gray-700 font-medium">
              ⏱ {movie.runtime} mins
            </span>
            <span className="bg-gray-800 px-4 py-1.5 rounded-lg text-gray-300 border border-gray-700 font-medium">
              📅 {movie.release_date?.split('-')[0]}
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm font-medium border border-gray-700">
                {genre.name}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 border-b border-gray-800 pb-2">Overview</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {movie.overview}
          </p>

          {trailer && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Trailer</h2>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-800">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Top Cast</h2>
          <div className="flex flex-wrap gap-6">
            {movie.credits?.cast?.slice(0, 5).map(actor => (
              <div key={actor.id} className="text-center w-20 md:w-24">
                <img 
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278/374151/9CA3AF?text=No+Photo'}
                  alt={actor.name}
                  className="w-full h-20 md:h-24 object-cover rounded-full mb-2 shadow-md border-2 border-gray-800"
                />
                <p className="text-xs text-gray-300 truncate font-medium">{actor.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;