const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

// Save Spotify User Profile
router.post("/save", async (req, res) => {
  const { uid, name, photoURL } = req.body;

  if (!uid || !name || !photoURL) {
    const missingFields = [
      !uid && "uid",
      !name && "name",
      !photoURL && "photoURL",
    ].filter(Boolean);

    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { uid },
      { $set: { name, photoURL, lastUpdated: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ message: "User data saved successfully!" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// Save Basket
router.post("/basket", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !basket) {
    const missingFields = [
      !uid && "uid",
      !basket && "basket",
    ].filter(Boolean);

    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { uid },
      { $set: { basket, lastUpdated: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ message: "Basket data saved successfully!" });
  } catch (error) {
    console.error("Error saving basket data:", error);
    res.status(500).json({ error: "Failed to save basket data." });
  }
});

// Save Basket (alternative endpoint)
router.post("/save-basket", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !basket) {
    const missingFields = [
      !uid && "uid",
      !basket && "basket",
    ].filter(Boolean);

    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { uid },
      { $set: { basket, lastUpdated: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ message: "Basket data saved successfully!" });
  } catch (error) {
    console.error("Error saving basket data:", error);
    res.status(500).json({ error: "Failed to save basket data." });
  }
});

// Save Movie Playlist
router.post("/save-movie-playlist", async (req, res) => {
  const { userId, movie, playlistLink, userRating, userComment } = req.body;

  console.log("Received data:", { userId, movie, playlistLink, userRating, userComment });

  if (!userId || !movie) {
    return res.status(400).json({ error: "Missing required fields: userId and movie are required." });
  }

  // Allow empty playlistLink for rating-only entries
  const finalPlaylistLink = playlistLink || `placeholder-playlist-${movie.id}`;

  try {
    const db = getDB();
    if (!db) {
      return res.status(500).json({ error: "Database not connected." });
    }
    const usersCollection = db.collection("users");

    // Check if the user already has a playlist for this movie
    const user = await usersCollection.findOne(
      { uid: userId },
      { projection: { moviePlaylists: 1 } }
    );

    console.log("Found user:", user ? "Yes" : "No");
    console.log("User playlists:", user?.moviePlaylists?.length || 0);

    const existingPlaylist = user?.moviePlaylists?.find(
      (playlist) => playlist.movie.id === movie.id
    );

    console.log("Existing playlist found:", existingPlaylist ? "Yes" : "No");

    if (existingPlaylist) {
      // Update existing playlist
      const result = await usersCollection.updateOne(
        { 
          uid: userId, 
          "moviePlaylists.movie.id": movie.id 
        },
        {
          $set: {
            "moviePlaylists.$.playlistLink": finalPlaylistLink,
            "moviePlaylists.$.userRating": userRating || null,
            "moviePlaylists.$.userComment": userComment || null,
            "moviePlaylists.$.savedAt": new Date(),
          },
        }
      );

      console.log("Update result:", result);
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Movie playlist updated successfully!" });
      } else {
        throw new Error("Failed to update the playlist.");
      }
    } else {
      // Add new playlist
      const result = await usersCollection.updateOne(
        { uid: userId },
        {
          $push: {
            moviePlaylists: {
              movie,
              playlistLink: finalPlaylistLink,
              userRating: userRating || null,
              userComment: userComment || null,
              savedAt: new Date(),
            },
          },
        },
        { upsert: true }
      );

      console.log("Insert result:", result);
      if (result.modifiedCount > 0 || result.upsertedCount > 0) {
        res.status(200).json({ message: "Movie playlist saved successfully!" });
      } else {
        throw new Error("Failed to insert the playlist.");
      }
    }
  } catch (error) {
    console.error("Error saving movie playlist:", error);
    res.status(500).json({ 
      error: "Failed to save movie playlist.",
      details: error.message 
    });
  }
});


// Fetch Movie Playlists
router.get("/fetch-movie-playlists/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing required field: userId." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid: userId }, { projection: { moviePlaylists: 1 } });

    if (!user || !user.moviePlaylists) {
      return res.status(404).json({ error: "No movie playlists found for this user." });
    }

    res.status(200).json(user.moviePlaylists);
  } catch (error) {
    console.error("Error fetching movie playlists:", error);
    res.status(500).json({ error: "Failed to fetch movie playlists." });
  }
});

// Save Comment and Rating
router.post("/rate-movie", async (req, res) => {
  const { userId, movieId, userRating, userComment } = req.body;

  if (!userId || !movieId || userRating === undefined || !userComment) {
    return res.status(400).json({ error: "Missing required fields: userId, movieId, userRating, or userComment." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    // Try both string and integer movieId to handle different formats
    const movieIdInt = parseInt(movieId);
    const result = await usersCollection.updateOne(
      { 
        uid: userId, 
        $or: [
          { "moviePlaylists.movie.id": movieIdInt },
          { "moviePlaylists.movie.id": movieId }
        ]
      },
      {
        $set: {
          "moviePlaylists.$.userRating": userRating,
          "moviePlaylists.$.userComment": userComment,
        },
      }
    );

    console.log("Rating and comment save result:", result);
    res.status(200).json({ message: "Comment and rating saved successfully!" });
  } catch (error) {
    console.error("Error saving comment and rating:", error);
    res.status(500).json({ error: "Failed to save comment and rating." });
  }
});

// Fetch Movie Playlist Details
router.get("/movie-playlists/:userId/:movieId", async (req, res) => {
  const { userId, movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "Missing required fields: userId or movieId." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    // Try both string and integer movieId to handle different formats
    const movieIdInt = parseInt(movieId);
    const user = await usersCollection.findOne(
      { 
        uid: userId, 
        $or: [
          { "moviePlaylists.movie.id": movieIdInt },
          { "moviePlaylists.movie.id": movieId }
        ]
      },
      { projection: { "moviePlaylists.$": 1 } }
    );

    if (!user || !user.moviePlaylists || user.moviePlaylists.length === 0) {
      return res.status(404).json({ error: "Movie playlist not found." });
    }

    res.status(200).json(user.moviePlaylists[0]);
  } catch (error) {
    console.error("Error fetching movie playlist details:", error);
    res.status(500).json({ error: "Failed to fetch movie playlist details." });
  }
});

// Fetch Comments and Ratings
router.get("/fetch-comments/:userId/:movieId", async (req, res) => {
  const { userId, movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "Missing required fields: userId or movieId." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    // Try both string and integer movieId to handle different formats
    const movieIdInt = parseInt(movieId);
    const user = await usersCollection.findOne(
      { 
        uid: userId, 
        $or: [
          { "moviePlaylists.movie.id": movieIdInt },
          { "moviePlaylists.movie.id": movieId }
        ]
      },
      { projection: { "moviePlaylists.$": 1 } }
    );

    if (!user || !user.moviePlaylists) {
      return res.status(404).json({ error: "Movie or playlist not found." });
    }

    res.status(200).json(user.moviePlaylists[0]);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// Complete Purchase
router.post("/complete-purchase", async (req, res) => {
  const { uid, basket, transactionId } = req.body;

  if (!uid || !basket || !transactionId) {
    return res.status(400).json({ error: "Missing required fields: uid, basket, or transactionId." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const purchases = basket.map((item) => ({
      ...item,
      transactionId,
      purchaseDate: new Date().toISOString(),
    }));

    const result = await usersCollection.updateOne(
      { uid },
      {
        $set: { basket: [] },
        $push: { purchases: { $each: purchases, $position: 0 } },
      }
    );

    console.log("Purchase complete result:", result);
    res.status(200).json({ success: true, message: "Purchase completed successfully!", purchases });
  } catch (error) {
    console.error("Error completing purchase:", error);
    res.status(500).json({ error: "Failed to complete purchase." });
  }
});

// Get User Data
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Failed to fetch user data." });
  }
});

// Delete User
router.delete("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ uid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    console.log("User deleted result:", result);
    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
