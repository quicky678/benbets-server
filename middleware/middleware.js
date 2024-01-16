const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware

const configureMiddleware = (app) => {
  app.use(cors()); // Enable CORS for all routes
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = configureMiddleware;
