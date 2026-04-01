// Import the Express.js framework
const express = require("express");

// Initialize an Express application instance
const app = express();

// Middleware: Parse incoming JSON requests and make the data available in req.body
app.use(express.json());

// Define a GET route for the root path ("/") that handles incoming requests
app.get("/", (req, res) => {
  // Send a response back to the client with the text "API is running"
  res.send("API is running");
});

// Start the server and listen for incoming connections on port 3000
app.listen(3000, () => {
  // Log a confirmation message to the console once the server is running
  console.log("Server running on port 3000");
});