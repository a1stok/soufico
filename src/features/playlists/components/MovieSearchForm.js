import React, { useState } from 'react';
import searchIcon from '../../../images/loop-icon.png';
import spotifyIcon from '../../../images/spotify-icon.png';

const MovieSearchForm = ({ onSearch, onMovieSelect, movies, error, userProfile, onSpotifyLogin, onSpotifyLogout }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }
    await onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <input
        type="text"
        className="styled-input"
        placeholder="Enter a movie name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="button-group">
        <button className="search-button" onClick={handleSearch}>
          <img src={searchIcon} alt="Search Icon" className="button-icon" />
          Search Movies
        </button>
        {userProfile ? (
          <button className="logout-button" onClick={onSpotifyLogout}>
            <img src={spotifyIcon} alt="Spotify Icon" className="button-icon" />
            Log out Spotify
          </button>
        ) : (
          <button className="spotify-button" onClick={onSpotifyLogin}>
            <img src={spotifyIcon} alt="Spotify Icon" className="button-icon" />
            Log in Spotify
          </button>
        )}
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="movie-results">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
              <p>Rating: {movie.vote_average.toFixed(1)}/10</p>
              <p className="movie-description">{movie.overview}</p>
              <button onClick={() => onMovieSelect(movie)}>Choose Movie</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearchForm;
