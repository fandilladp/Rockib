const express = require('express');
const connectDB = require('./config/configDB');
const logRoutes = require('./routes/logRoutes');
const verifyToken = require("./secure/verifyToken");
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
connectDB();
app.use(verifyToken);
// Setup cache with a default TTL of 60 seconds
const cache = new NodeCache({ stdTTL: 3 });

// Middleware to check cache before processing request
app.use((req, res, next) => {
  const key = req.originalUrl; // Cache key based on the request URL
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse); // Return cached response if found
  }

  // Override res.json to store the response in cache
  const originalJson = res.json;
  res.json = (body) => {
    cache.set(key, body);
    return originalJson.call(res, body);
  };

  next();
});

app.use(express.json());
app.use('/api', logRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
