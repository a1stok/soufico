require("dotenv").config();
const { MongoClient } = require("mongodb");

// console.log("MONGO_URI:", process.env.MONGO_URI); // SECURITY: Removed to prevent URI logging

let db; 
let client; 
let isConnected = false;

async function connectToDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        // Removed deprecated options: bufferMaxEntries, useNewUrlParser, useUnifiedTopology
      });
    }

    if (!isConnected) {
      await client.connect();
      console.log("MongoDB Client connected successfully!");
      isConnected = true;
    }

    if (!db) {
      db = client.db("Soufico");
      console.log("Connected to database: Soufico");
      
      // Test the connection
      await db.admin().ping();
      console.log("Database ping successful - MongoDB is ready!");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.log("Make sure MongoDB is running and MONGO_URI is correct");
    console.log("For local MongoDB: mongodb://localhost:27017/Soufico");
    console.log("For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/Soufico");
    isConnected = false;
    throw error; // Re-throw to handle in server.js
  }
}

function getDB() {
  if (!db || !isConnected) {
    console.log("Database not connected!");
    console.log("Make sure MongoDB is running and try again");
    throw new Error("Database not connected. Please check MongoDB connection.");
  }
  return db;
}

function isDBConnected() {
  return isConnected && db !== null;
}

async function disconnectDB() {
  if (client) {
    await client.close();
    console.log("MongoDB Client disconnected.");
    db = null; 
    client = null; 
    isConnected = false;
  }
}

module.exports = { connectToDB, getDB, disconnectDB, isDBConnected };
