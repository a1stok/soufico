import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  createPlaylist,
} from "../core/api/spotifyService";
import { SPOTIFY_AUTH_URL } from "../core/config/spotify";
import {
  saveMoviePlaylist,
  fetchMoviePlaylistDetails,
} from "../core/api/userService";
import "../styles/pages/MovieDetailsPage.css";

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie || null;

  const [playlistLink, setPlaylistLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userRating, setUserRating] = useState("");
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    const fetchUserProfileAndPlaylist = async () => {
      try {
        // Check for existing login without prompting
        const accessToken = localStorage.getItem("spotify_access_token");
        if (!accessToken) {
            // No Spotify access token found
          return;
        }

        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          
          // Save user ID to localStorage for other pages
          localStorage.setItem("spotify_user_id", profile.id);

          const userId = profile.id;
          const playlistDetails = await fetchMoviePlaylistDetails(
            userId,
            movie.id
          );
          if (playlistDetails) {
            setPlaylistLink(playlistDetails.playlistLink);
            setUserRating(playlistDetails.userRating || "");
            setUserComment(playlistDetails.userComment || "");
          }
        } else {
          // Token is invalid, clear it
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_user_id");
            // Spotify access token is invalid
        }
      } catch (error) {
        console.error("Error fetching Spotify profile or playlist:", error);
        // Clear invalid tokens
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_user_id");
      }
    };

    if (movie) fetchUserProfileAndPlaylist();
  }, [movie]);

  const handleCreatePlaylist = async () => {
    if (!userProfile) {
      alert("Please log in to Spotify first.");
      window.location.href = SPOTIFY_AUTH_URL;
      return;
    }

    if (playlistLink) {
      alert("A playlist is already associated with this movie.");
      return;
    }

    setIsLoading(true);
    try {
      const playlist = await createPlaylist(
        userProfile.id,
        `${movie.title} Playlist`
      );
      if (!playlist) {
        alert("Failed to create playlist. Please try again.");
        return;
      }
      setPlaylistLink(`https://open.spotify.com/embed/playlist/${playlist.id}`);
      alert("Playlist created successfully!");
    } catch (error) {
      console.error("Error creating Spotify playlist:", error);
      alert("Failed to create the playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToPlaylist = async () => {
    if (!playlistLink) {
      alert("Create or link a playlist first.");
      return;
    }

    if (userRating === "" || userComment === "") {
      alert("Please add a rating and comment.");
      return;
    }

    try {
      const userId = userProfile?.id;
      if (!userId) {
        alert("User ID is missing. Please log in.");
        return;
      }

      await saveMoviePlaylist({
        userId,
        movie,
        playlistLink,
        userRating,
        userComment,
      });

      alert("Saved to your movie playlist!");

      setUserRating(userRating);
      setUserComment(userComment);
    } catch (error) {
      console.error("Error saving movie playlist:", error);
      alert("Failed to save the movie playlist.");
    }
  };

  const handleLinkPlaylist = () => {
    const userInput = prompt("Paste your Spotify playlist link here:");
    try {
      const url = new URL(userInput);
      if (!url.hostname.includes("spotify.com") || !url.pathname.includes("/playlist/")) {
        throw new Error("Invalid Spotify playlist URL.");
      }
      const playlistId = url.pathname.split("/playlist/")[1];
      setPlaylistLink(`https://open.spotify.com/embed/playlist/${playlistId}`);
      alert("Playlist linked successfully!");
    } catch (error) {
      alert(`Invalid URL format: ${error.message}`);
    }
  };

  const handleBackToSearch = () => {
    window.history.back();
  };

  if (!movie) {
    return <p>No movie details available. Please go back and select a movie.</p>;
  }

  return (
    <div className="movie-details-container">
      <div className="back-button-container">
        <button 
          onClick={handleBackToSearch}
          className="save-rating-btn"
        >
          ← Back to Search
        </button>
      </div>
      
      <h1>Create Playlist for {movie.title}</h1>
      
      {playlistLink ? (
        <div className="playlist-container">
          <iframe
            title="Spotify Embed: Recommendation Playlist"
            src={playlistLink}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="spotify-embed"
          />
        </div>
      ) : (
        <button
          onClick={handleCreatePlaylist}
          disabled={isLoading}
          className="save-rating-btn"
        >
          {isLoading ? "Creating..." : "Create Playlist"}
        </button>
      )}

      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
      </div>

      <div className="rating-section">
        <h3>Rate and Comment</h3>
        <div className="rating-form">
          <div className="form-group">
            <label>Your Rating (1-10):</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              placeholder="Rating (0-10)"
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
              className="styled-input"
            />
          </div>
          <div className="form-group">
            <label>Your Comment:</label>
            <input
              type="text"
              placeholder="Share your thoughts about this movie..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="styled-input"
            />
          </div>
          <button onClick={handleSaveToPlaylist} className="save-rating-btn">
            Save Rating & Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
