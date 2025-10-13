import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      
      // Fetch user profile and save user ID
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(response => response.json())
        .then(profile => {
          localStorage.setItem("spotify_user_id", profile.id);
          navigate("/subscriptions");
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
          navigate("/subscriptions"); // Still navigate even if profile fetch fails
        });
    } else {
      console.error("Spotify login failed. Redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Processing Spotify Login...</p>;
};

export default SpotifyCallback;
