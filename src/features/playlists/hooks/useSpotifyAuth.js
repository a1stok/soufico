import { useState, useEffect } from 'react';
import { fetchUserPlaylists } from '../../../core/api/spotifyService';
import { SPOTIFY_AUTH_URL } from '../../../core/config/spotify';

export const useSpotifyAuth = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkExistingLogin = async () => {
      const accessToken = localStorage.getItem("spotify_access_token");
      if (!accessToken) return;

      try {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);
          localStorage.setItem("spotify_user_id", profileData.id);

          const playlistsData = await fetchUserPlaylists();
          setPlaylists(playlistsData?.items || []);
        } else {
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_user_id");
        }
      } catch (err) {
        console.error("Error checking existing login:", err);
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_user_id");
      }
    };

    checkExistingLogin();
  }, []);

  const handleLogin = () => {
    window.location.href = SPOTIFY_AUTH_URL;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_user_id");
    setUserProfile(null);
    setPlaylists([]);
    alert("Logged out of Spotify.");
  };

  return {
    userProfile,
    playlists,
    error,
    setError,
    handleLogin,
    handleLogout
  };
};
