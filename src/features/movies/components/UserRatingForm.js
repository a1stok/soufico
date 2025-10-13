import React, { useState, useEffect } from 'react';
import { saveMoviePlaylist, fetchMoviePlaylistDetails } from '../../../core/api/userService';

const UserRatingForm = ({ movie, userProfile, playlistLink: propPlaylistLink }) => {
  const [userRating, setUserRating] = useState("");
  const [userComment, setUserComment] = useState("");
  const [playlistLink, setPlaylistLink] = useState(propPlaylistLink || "");

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!userProfile || !movie) return;

      try {
        const playlistDetails = await fetchMoviePlaylistDetails(
          userProfile.id,
          movie.id
        );
        if (playlistDetails) {
          setPlaylistLink(playlistDetails.playlistLink || "");
          setUserRating(playlistDetails.userRating || "");
          setUserComment(playlistDetails.userComment || "");
        }
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    fetchExistingData();
  }, [userProfile, movie]);

  // Update playlistLink when prop changes
  useEffect(() => {
    if (propPlaylistLink) {
      setPlaylistLink(propPlaylistLink);
    }
  }, [propPlaylistLink]);

  const handleSave = async () => {
    if (!userProfile || !movie) return;

    // Validate inputs
    if (!userRating || userRating < 1 || userRating > 10) {
      alert("Please enter a valid rating between 1 and 10.");
      return;
    }

    if (!userComment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      // Always send a valid playlist link (either existing or placeholder)
      const playlistLinkToSend = playlistLink && playlistLink.trim() !== "" 
        ? playlistLink 
        : `placeholder-playlist-${movie.id}`;
      
      console.log("Sending data:", {
        userId: userProfile.id,
        movie: movie,
        playlistLink: playlistLinkToSend,
        userRating: parseInt(userRating),
        userComment: userComment.trim()
      });

      await saveMoviePlaylist({
        userId: userProfile.id,
        movie: movie,
        playlistLink: playlistLinkToSend,
        userRating: parseInt(userRating),
        userComment: userComment.trim()
      });
      alert("Rating and comment saved successfully!");
    } catch (error) {
      console.error("Error saving rating:", error);
      alert("Failed to save rating. Please try again.");
    }
  };

  if (!userProfile) return null;

  return (
    <div className="rating-section">
      <h3>Rate and Comment</h3>
      <div className="rating-form">
        <div className="form-group">
          <label>Your Rating (1-10):</label>
          <input
            type="number"
            min="1"
            max="10"
            value={userRating}
            onChange={(e) => setUserRating(e.target.value)}
            className="styled-input rating-input"
            placeholder="Rating (1-10)"
          />
        </div>
        <div className="form-group">
          <label>Your Comment:</label>
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="styled-input comment-input"
            placeholder="Share your thoughts about this movie..."
            rows="4"
          />
        </div>
        <button onClick={handleSave} className="save-rating-btn">
          Save Rating & Comment
        </button>
      </div>
    </div>
  );
};

export default UserRatingForm;
