  import React, { useState, useEffect } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import { SPOTIFY_AUTH_URL } from '../../../core/config/spotify';
  import MovieInfo from '../components/MovieInfo';
  import PlaylistCreator from '../../playlists/components/PlaylistCreator';
  import UserRatingForm from '../components/UserRatingForm';

  const MovieDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const movie = location.state?.movie || null;

    const [userProfile, setUserProfile] = useState(null);
    const [playlistLink, setPlaylistLink] = useState("");

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const accessToken = localStorage.getItem("spotify_access_token");
          if (!accessToken) {
            console.log("No Spotify access token found. User needs to log in.");
            return;
          }

          const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (response.ok) {
            const profile = await response.json();
            setUserProfile(profile);
            localStorage.setItem("spotify_user_id", profile.id);
          } else {
            localStorage.removeItem("spotify_access_token");
            localStorage.removeItem("spotify_user_id");
            console.log("Spotify access token is invalid. User needs to log in.");
          }
        } catch (error) {
          console.error("Error fetching Spotify profile:", error);
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_user_id");
        }
      };

      if (movie) {
        fetchUserProfile();
      }
    }, [movie]);

    const handlePlaylistCreated = (link) => {
      setPlaylistLink(link);
    };

    const handleBackToSearch = () => {
      navigate('/subscriptions');
    };

    if (!movie) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>Movie not found</h1>
          <button onClick={handleBackToSearch}>Back to Search</button>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={handleBackToSearch}
          className="create-playlist-btn"
          style={{ marginBottom: '20px' }}
        >
          ← Back to Search
        </button>
        
        <MovieInfo movie={movie} />
        
        {userProfile ? (
          <>
            <PlaylistCreator 
              movie={movie} 
              userProfile={userProfile}
              onPlaylistCreated={handlePlaylistCreated}
            />
            <UserRatingForm 
              movie={movie} 
              userProfile={userProfile} 
              playlistLink={playlistLink}
            />
          </>
        ) : (
          <div style={{ margin: '20px 0' }}>
            <h2>Login Required</h2>
            <p>Please log in to Spotify to create playlists and rate movies.</p>
            <button 
              onClick={() => window.location.href = SPOTIFY_AUTH_URL}
              style={{
                padding: '10px 20px',
                background: '#1db954',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Log in to Spotify
            </button>
          </div>
        )}
      </div>
    );
  };

  export default MovieDetailsPage;
