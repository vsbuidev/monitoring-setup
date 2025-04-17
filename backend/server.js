const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
require("dotenv").config();

const app = express();

// prometheus client
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 200, 300, 400, 500, 1000],
});

app.use(express.json());
app.use(require("cors")());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.originalUrl, res.statusCode)
      .observe(duration);
  });
  next();
});

// prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

const mongoURI = process.env.MONGO_URI;

// mongoose connection
mongoose
  .connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

// redis connection
redisClient
  .connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch((err) => console.error("❌ Redis connection error:", err));

// mongoose schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

// Create User
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.json(user);
});

// Get All Users (with Redis caching)
app.get("/api/users", async (req, res) => {
  const cachedUsers = await redisClient.get("users");
  if (cachedUsers) {
    return res.json(JSON.parse(cachedUsers));
  }
  const users = await User.find();
  await redisClient.setEx("users", 60, JSON.stringify(users)); // Cache for 60s
  res.json(users);
});

// Update User
app.put("/api/users/:id", async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true }
  );
  res.json(user);
});

// Delete User
app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
