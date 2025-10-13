import axios from "axios";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from "../config/spotify";

export const getSpotifyAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URI
  )}&scope=playlist-read-private playlist-modify-private playlist-modify-public user-read-private`;
};

export const ensureValidAccessToken = async () => {
  const accessToken = localStorage.getItem("spotify_access_token");

  if (!accessToken) {
    alert("Please log in to Spotify.");
    window.location.href = getSpotifyAuthUrl();
    return null;
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 200) {
      const userProfile = response.data;
      localStorage.setItem("spotify_user_id", userProfile.id); 
      await saveSpotifyUser({
        uid: userProfile.id,
        name: userProfile.display_name,
        photoURL: userProfile.images?.[0]?.url || "",
      });

      return accessToken;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("spotify_access_token");
      window.location.href = getSpotifyAuthUrl();
    }
    console.error("Error ensuring valid access token:", error);
  }
  return null;
};

export const saveSpotifyUser = async ({ uid, name, photoURL }) => {
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://soufico.onrender.com/api/users"
      : `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/users`;

  try {
    const response = await axios.post(`${BASE_URL}/save`, {
      uid,
      name,
      photoURL,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving Spotify user:", error.response?.data || error.message);
    throw error;
  }
};

export const createPlaylist = async (userId, playlistName) => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name: playlistName, public: false },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error.response?.data || error.message);
    return null;
  }
};

export const fetchUserPlaylists = async () => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data.items; 
  } catch (error) {
    console.error("Error fetching user playlists:", error.response?.data || error.message);
    return null;
  }
};

export const addTracksToPlaylist = async (playlistId, trackUris) => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding tracks to playlist:", error.response?.data || error.message);
    return null;
  }
};

export const searchSpotifyTracks = async (query) => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data.tracks.items;
  } catch (error) {
    console.error("Error searching Spotify tracks:", error.response?.data || error.message);
    return null;
  }
};

export const getPlaylistDetails = async (playlistId) => {
  const accessToken = await ensureValidAccessToken();
  if (!accessToken) return null;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist details:", error.response?.data || error.message);
    return null;
  }
};
