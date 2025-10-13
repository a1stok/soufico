import React from 'react';

const PlaylistList = ({ playlists }) => {
  if (!playlists || playlists.length === 0) {
    return null;
  }

  return (
    <div className="playlists-section">
      <h2>Your Spotify Playlists</h2>
      <ul className="playlist-list">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="playlist-item">
            <a
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              {playlist.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistList;
