const HOSTNAME = window.location.hostname;

export const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || "your-spotify-client-id";
export const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || "your-spotify-client-secret";

export const SPOTIFY_REDIRECT_URI =
  HOSTNAME === "localhost"
    ? "http://localhost:3000/callback"
    : process.env.REACT_APP_PRODUCTION_URL
    ? `${process.env.REACT_APP_PRODUCTION_URL}/callback`
    : "https://your-app.com/callback";

export const SPOTIFY_SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private"
];

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI
)}&scope=${encodeURIComponent(SPOTIFY_SCOPES.join(" "))}`;
