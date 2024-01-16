const express = require("express");
const configureMiddleware = require("./middleware/middleware");
require("dotenv").config();

//Import Routes
const predictionRoutes = require("./routes/predictionRoutes");
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
configureMiddleware(app);

// Routes
app.use("/api", userRoutes);
app.use("/api", predictionRoutes);
app.use("/api", emailRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
