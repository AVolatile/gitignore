// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import the express module and path module
const express = require('express');
const path = require('path');

// Retrieve the SECRET_USER and PORT variables from the environment
const doxname = process.env.SECRET_USER;
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined

// Log the SECRET_USER to the console
console.log(doxname);

// Create an instance of an Express application
const app = express();

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route handler for the root URL ('/')
app.get('/', function (req, res) {
  // Send the index.html file located in the "public" directory
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
  // Log a message indicating the server is running and on which port
  console.log(`Server is running on port ${PORT}`);
});
