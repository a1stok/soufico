import axios from "axios";

// Use environment variable for security; do not hardcode tokens
const TMDB_ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN || "";
if (!TMDB_ACCESS_TOKEN) {
  // eslint-disable-next-line no-console
  console.warn(
    "TMDB access token is not set. Please define REACT_APP_TMDB_ACCESS_TOKEN in your environment."
  );
}

export const searchMovies = async (query) => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
      params: {
        query,
      },
    });
    return response.data.results; 
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const fetchGenresFromTMDb = async () => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/genre/movie/list", {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });
    return response.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name; 
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching genres from TMDb:", error);
    return {};
  }
};
