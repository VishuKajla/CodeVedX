import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&region=IN`);
        const data = await response.json();
        
        setSuggestions(data.results.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query);
      setQuery(""); // <-- FIX: Clears the search bar after pressing Enter
    }
  };

  const handleSuggestionClick = (suggestionTitle) => {
    setShowSuggestions(false);
    onSearch(suggestionTitle);
    setQuery(""); // <-- FIX: Clears the search bar after clicking a suggestion
  };

  return (
    <div className="relative w-full mt-4">
      <form onSubmit={handleSubmit} className="flex w-full">
        <input 
          type="text" 
          placeholder="Search for a movie..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setShowSuggestions(false)}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          className="w-full px-6 py-4 bg-gray-900 text-white rounded-l-full border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
        />
        <button 
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-r-full hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full md:w-[calc(100%-120px)] left-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden text-left">
          {suggestions.map((movie) => (
            <li 
              key={movie.id}
              onMouseDown={() => handleSuggestionClick(movie.title)}
              className="px-6 py-3 hover:bg-gray-800 cursor-pointer text-gray-300 hover:text-white transition-colors flex items-center gap-3 border-b border-gray-800 last:border-none"
            >
              <span>🍿</span> 
              <span className="font-semibold">{movie.title}</span> 
              <span className="text-sm text-gray-500 ml-auto">
                {movie.release_date ? movie.release_date.split('-')[0] : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;