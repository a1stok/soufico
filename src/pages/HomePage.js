import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/HomePage.css';
import catImage from '../images/cat.jpg'; 

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Soufico</h1>
      <p>Your custom Spotify playlists inspired by movies.</p>
      <div className="home-links">
        <Link to="/shop">Shop - Browse the selection, not available for purchase yet.</Link>
        <Link to="/subscriptions">Film Playlist - Generate movie-inspired playlists.</Link>
        <Link to="/my-playlist">My Playlist - Manage your saved Spotify playlists.</Link>
        <Link to="/my-account">My Account - Access your profile and features.</Link>
        <Link to="/login">Login - Log in to access personalized features.</Link>
      </div>
      <div className="cat-image-container">
        <img src={catImage} alt="Cute Cat" className="mereal" />
      </div>
    </div>
  );
};

export default HomePage;
