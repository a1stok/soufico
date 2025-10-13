import React, { useState } from 'react';
import { createPlaylist } from '../../../core/api/spotifyService';
import { saveMoviePlaylist } from '../../../core/api/userService';

const PlaylistCreator = ({ movie, userProfile, onPlaylistCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [playlistLink, setPlaylistLink] = useState("");

  const handleCreatePlaylist = async () => {
    if (!userProfile) {
      alert("Please log in to Spotify first.");
      return;
    }

    setIsLoading(true);
    try {
      const playlist = await createPlaylist(userProfile.id, `${movie.title} Playlist`);
      
      if (playlist && playlist.id) {
        const embedLink = `https://open.spotify.com/embed/playlist/${playlist.id}`;
        setPlaylistLink(embedLink);
        
        // Save to user's collection
        await saveMoviePlaylist({
          userId: userProfile.id,
          movie: movie,
          playlistLink: embedLink,
          userRating: null,
          userComment: ""
        });
        
        onPlaylistCreated(embedLink);
        alert("Playlist created successfully!");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkPlaylist = async () => {
    const userInput = prompt("Paste your Spotify playlist link here:");
    try {
      const url = new URL(userInput);
      if (!url.hostname.includes("spotify.com") || !url.pathname.includes("/playlist/")) {
        throw new Error("Invalid Spotify playlist URL.");
      }
      const playlistId = url.pathname.split("/playlist/")[1];
      const embedLink = `https://open.spotify.com/embed/playlist/${playlistId}`;
      setPlaylistLink(embedLink);
      
      // Save the linked playlist to the database
      await saveMoviePlaylist({
        userId: userProfile.id,
        movie: movie,
        playlistLink: embedLink,
        userRating: null,
        userComment: ""
      });
      
      onPlaylistCreated(embedLink);
      alert("Playlist linked and saved successfully!");
    } catch (error) {
      alert(`Invalid URL format: ${error.message}`);
    }
  };

  return (
    <div className="playlist-section">
      <h2>Create Playlist for {movie.title}</h2>
      {playlistLink ? (
        <div className="playlist-created">
          <p>Playlist created successfully!</p>
          <div className="playlist-embed-container">
            <iframe
              src={playlistLink}
              width="100%"
              height="352"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              title={`Spotify playlist for ${movie.title}`}
              className="spotify-embed"
              onError={(e) => {
                console.log("Spotify iframe blocked by CSP, showing fallback");
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `
                  <div className="playlist-fallback">
                    <p>🎵 Playlist created successfully!</p>
                    <a href="${playlistLink.replace('/embed/', '/')}" target="_blank" rel="noopener noreferrer" className="playlist-link">
                      Open Playlist in Spotify
                    </a>
                  </div>
                `;
              }}
            />
          </div>
        </div>
      ) : (
        <div className="playlist-actions">
          <button 
            onClick={handleCreatePlaylist} 
            disabled={isLoading}
            className="create-playlist-btn"
          >
            {isLoading ? 'Creating...' : 'Create Playlist'}
          </button>
          <button 
            onClick={handleLinkPlaylist}
            className="link-playlist-btn"
            style={{ marginLeft: '10px' }}
          >
            Link New Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistCreator;
