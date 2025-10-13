import React from 'react';

const MovieInfo = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="movie-info">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-details">
        <h1>{movie.title}</h1>
        <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
        <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</p>
        <p><strong>Overview:</strong></p>
        <p className="movie-overview">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieInfo;
