import React, { useState, useEffect } from "react";
import "../styles/pages/MyCollectionPage.css";
import { fetchUserMoviePlaylists } from "../core/api/userService";

const MyCollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userProfile, setUserProfile] = useState({
    photo: "",
    name: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            photo: data.images?.[0]?.url || "",
            name: data.display_name || "",
          });
          localStorage.setItem("user_photo", data.images?.[0]?.url || "");
          localStorage.setItem("user_name", data.display_name || "");
        }
      } catch (error) {
        console.error("Error fetching Spotify profile:", error);
      }
    };

    if (!localStorage.getItem("user_photo")) {
      fetchUserProfile();
    } else {
      setUserProfile({
        photo: localStorage.getItem("user_photo"),
        name: localStorage.getItem("user_name"),
      });
    }
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const userId = localStorage.getItem("spotify_user_id");
        if (!userId) {
          setError("Please log in to Spotify to view your collections.");
          setLoading(false);
          return;
        }

        const data = await fetchUserMoviePlaylists(userId);
        setCollections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to fetch collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleEditMovieDetails = () => {
    if (!selectedMovie || !selectedMovie.movie) return;
    
    setCollections((prev) =>
      prev.map((item) =>
        item.movie.id === selectedMovie.movie.id ? { ...item, ...selectedMovie } : item
      )
    );
    setSelectedMovie(null);
  };

  const handleChangeRating = () => {
    if (!selectedMovie) return;
    
    const newRating = parseFloat(
      prompt("Enter your new rating (0-10 in increments of 0.5):", selectedMovie.userRating || "")
    );

    if (newRating >= 0 && newRating <= 10 && newRating % 0.5 === 0) {
      setSelectedMovie((prev) => ({ ...prev, userRating: newRating }));
    } else {
      alert("Invalid rating! Please enter a value between 0 and 10 in increments of 0.5.");
    }
  };

  const handleChangeComment = () => {
    if (!selectedMovie) return;
    
    const newComment = prompt("Enter your new comment:", selectedMovie.userComment || "");
    if (newComment !== null) {
      setSelectedMovie((prev) => ({ ...prev, userComment: newComment }));
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <p className="loading-message">Loading your playlists...</p>
      </div>
    );

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-collection-page">
      <div className="header-section">
        <h1>My Movie Playlist</h1>
        <div className="user-info">
          <div className="user-profile">
            <img
              src={userProfile.photo}
              alt="User Avatar"
              className="user-avatar"
            />
            <h2>{userProfile.name}</h2>
          </div>
        </div>
      </div>
      
      {selectedMovie ? (
  <div className="movie-details">
    <div className="movie-details-group">
      <div className="movie-poster-section">
        <img
          src={`https://image.tmdb.org/t/p/w500${selectedMovie.movie.poster_path}`}
          alt={selectedMovie.movie.title}
          className="movie-poster-details"
        />
      </div>
      <div className="spotify-playlist-section">
        {selectedMovie.playlistLink ? (
          <iframe
            title="Spotify Playlist"
            src={selectedMovie.playlistLink}
            width="380"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="spotify-iframe"
          ></iframe>
        ) : (
          <p className="no-playlist-message">No playlist linked to this movie yet.</p>
        )}
      </div>
    </div>
    <div className="details-content">
      <h2>{selectedMovie.movie.title}</h2>
      <p className="movie-overview">
        <strong>Description:</strong>
        <br />
        {selectedMovie.movie.overview}
      </p>
      <p className="rating-display">
        <strong>Personal Rating:</strong> {selectedMovie.userRating || "Not rated yet."}
      </p>
      <p className="comment-display">
        <strong>Your Comment:</strong>{" "}
        {selectedMovie.userComment && selectedMovie.userComment.length > 100
          ? `${selectedMovie.userComment.slice(0, 100)}...`
          : selectedMovie.userComment || "No comment yet."}
      </p>
      <div className="action-buttons">
        <button onClick={handleChangeRating} className="button-other">
          Change Your Rating
        </button>
        <button onClick={handleChangeComment} className="button-other">
          Change Your Comment
        </button>
        <button onClick={handleEditMovieDetails} className="button-save">
          Save Changes
        </button>
      </div>
    </div>
  </div>
) : collections && collections.length > 0 ? (
        <div className="collection-grid">
          {collections.map((item) => (
            <div
              key={item.movie.id}
              className="collection-card"
              onClick={() => setSelectedMovie(item)}
            >
              <div className="card-content">
                <img
                  src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                  alt={item.movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3>{item.movie.title}</h3>
                  <p className="rating"><strong>Rating:</strong> {item.userRating || "Not rated yet."}</p>
                  <p className="review">
                    <strong>Review:</strong>{" "}
                    {item.userComment && item.userComment.length > 50
                      ? `${item.userComment.slice(0, 50)}...`
                      : item.userComment || "No review yet."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-playlists">
          <h2>Your Spotify Playlists</h2>
          <p>You don't have any playlists yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyCollectionPage;