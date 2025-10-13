const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables FIRST
dotenv.config();

const { connectToDB, isDBConnected } = require("./db");
const userRoutes = require("./routes/userRoutes");
const { getDB } = require("./db");
// Initialize Stripe with fallback for development
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    console.log("Stripe initialized successfully");
  } else {
    console.log("Stripe not configured - payment features will be limited");
  }
} catch (error) {
  console.log("Stripe initialization failed - payment features will be limited");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Increase request size limit to handle larger payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://your-frontend.onrender.com',
      'https://your-app.onrender.com',
      'https://your-app.web.app'
    ]
  : [
      'http://localhost:3000', 
      'http://127.0.0.1:3000'
    ];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
  })
);

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Connect to MongoDB with proper error handling
async function startServer() {
  try {
    await connectToDB();
    console.log("Server starting with MongoDB connection...");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.log("Server will start without database connection...");
    console.log("Please check your MongoDB setup and restart the server");
    console.log("For local development, you can use MongoDB Atlas or local MongoDB");
  }
}

startServer();

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = isDBConnected() ? "connected" : "disconnected";
  res.json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/users", userRoutes);

// Add the save-basket endpoint directly in server.js
app.post("/api/users/save-basket", async (req, res) => {
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

// Add missing order endpoint
app.post("/api/users/order", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !Array.isArray(basket)) {
    return res.status(400).json({ error: "Missing required fields: uid and basket" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    // Save the order
    const order = {
      uid,
      basket,
      orderDate: new Date(),
      status: "pending"
    };

    await usersCollection.updateOne(
      { uid },
      { $push: { orders: order } },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order." });
  }
});

app.post("/api/users/basket", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !Array.isArray(basket)) {
    const missingFields = [
      !uid && "uid",
      !Array.isArray(basket) && "basket (must be an array)",
    ].filter(Boolean);

    return res.status(400).json({
      error: `Missing or invalid fields: ${missingFields.join(", ")}`,
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

    res.status(200).json({ success: true, message: "Basket updated successfully!" });
  } catch (error) {
    console.error("Error updating basket:", error);
    res.status(500).json({ error: "Failed to update basket." });
  }
});

app.get("/api/users/basket/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid }, { projection: { basket: 1 } });

    if (!user || !user.basket) {
      return res.status(404).json({ error: "Basket not found for the user." });
    }

    res.status(200).json({ success: true, basket: user.basket });
  } catch (error) {
    console.error("Error fetching basket:", error);
    res.status(500).json({ error: "Failed to fetch basket." });
  }
});

app.post("/api/payment/create-payment-intent", async (req, res) => {
  const { basket } = req.body;

  if (!basket || !Array.isArray(basket)) {
    return res.status(400).json({ error: "Invalid basket format." });
  }

  if (!stripe) {
    return res.status(500).json({ 
      error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables." 
    });
  }

  const totalAmount = basket.reduce(
    (sum, item) => sum + item.price * item.quantity * 100,
    0
  );

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent." });
  }
});

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server has been closed.");
  });
});
