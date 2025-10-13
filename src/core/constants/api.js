const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.onrender.com/api'
    : 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_BASE_URLS = {
  DEVELOPMENT: 'http://localhost:3001/api',
  PRODUCTION: 'https://soufico-backend.onrender.com/api'
};

export const API_ENDPOINTS = {
  USERS: '/users',
  PAYMENTS: '/payments',
  BASKET: '/basket',
  ORDERS: '/order',
  PLAYLISTS: '/playlists'
};

export const SPOTIFY_SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private'
];

export const TMDB_CONFIG = {
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    SMALL: 'w200',
    MEDIUM: 'w500',
    LARGE: 'w1280'
  }
};
