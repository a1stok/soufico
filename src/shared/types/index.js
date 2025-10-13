// Movie related types
export const Movie = {
  id: 'number',
  title: 'string',
  overview: 'string',
  poster_path: 'string',
  release_date: 'string',
  vote_average: 'number',
  vote_count: 'number'
};

// User related types
export const UserProfile = {
  id: 'string',
  display_name: 'string',
  email: 'string',
  images: 'array'
};

// Playlist related types
export const Playlist = {
  id: 'string',
  name: 'string',
  external_urls: 'object',
  tracks: 'object'
};

// Service related types
export const Service = {
  id: 'number',
  name: 'string',
  description: 'string',
  price: 'number',
  image: 'string'
};

// API Response types
export const ApiResponse = {
  success: 'boolean',
  data: 'any',
  error: 'string',
  message: 'string'
};
