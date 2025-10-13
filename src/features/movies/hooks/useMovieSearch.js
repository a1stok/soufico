import { useState } from 'react';
import { searchMovies } from '../../../core/api/tmdbService';

export const useMovieSearch = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const searchMoviesHandler = async (query) => {
    if (!query.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    try {
      const results = await searchMovies(query);

      const filteredMovies = results
        .filter(
          (movie) =>
            movie.poster_path &&
            movie.release_date &&
            movie.vote_count > 25 &&
            movie.overview
        )
        .sort((a, b) => b.vote_count - a.vote_count);

      if (filteredMovies.length === 0) {
        setError("No suitable movies found. Try another name.");
      } else {
        setMovies(filteredMovies);
        setError("");
      }
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      console.error("Error searching movies:", err);
    }
  };

  return {
    movies,
    error,
    searchMovies: searchMoviesHandler
  };
};
