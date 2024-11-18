const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb://localhost:27017"; // Your MongoDB URI
const dbName = "Movie_Review"; // Database name
let db;

MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

/** 
 * User Authentication Routes 
 */

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields (name, email, password) are required" });
  }

  try {
    const existingUser = await db.collection("Login_Credentials").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };

    await db.collection("Login_Credentials").insertOne(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error, please try again later" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await db.collection("Login_Credentials").findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", userId: user._id }); // Optionally return user ID
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error, please try again later" });
  }
});

/** 
 * Movie Review Routes 
 */

// Submit a review
// Submit a review
app.post("/api/reviews", async (req, res) => {
  const { movieId, username, reviewText } = req.body;

  if (!movieId || !username || !reviewText) {
      return res.status(400).json({ message: "Movie ID, username and review text are required." });
  }

  try {
      const newReview = { movieId, username, reviewText };
      
      await db.collection("Reviews").insertOne(newReview);
      
      res.status(201).json(newReview);
  } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// Get reviews for a specific movie
app.get("/api/reviews/:movieId", async (req, res) => {
  const { movieId } = req.params;

  try {
    const reviews = await db.collection("Reviews").find({ movieId }).toArray();
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});