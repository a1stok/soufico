import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSearchForm from '../components/MovieSearchForm';
import PlaylistList from '../components/PlaylistList';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import { useMovieSearch } from '../../movies/hooks/useMovieSearch';
import '../../../styles/features/playlists/SubscriptionsPage.css';

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const { userProfile, playlists, error: authError, handleLogin, handleLogout } = useSpotifyAuth();
  const { movies, error: searchError, searchMovies } = useMovieSearch();

  const handleMovieSelection = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="subscriptions-page">
      <h1>Generate a Movie-Based Playlist</h1>

      <div className="search-section">
        <MovieSearchForm
          onSearch={searchMovies}
          onMovieSelect={handleMovieSelection}
          movies={movies}
          error={searchError}
          userProfile={userProfile}
          onSpotifyLogin={handleLogin}
          onSpotifyLogout={handleLogout}
        />
      </div>

      {authError && <p className="error-message">{authError}</p>}

      <PlaylistList playlists={playlists} />
    </div>
  );
};

export default SubscriptionsPage;
