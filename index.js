// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import the express module, path module, mysql module, and body-parser module
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Retrieve the SECRET_USER and PORT variables from the environment
const doxname = process.env.SECRET_USER;
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined

// Log the SECRET_USER to the console
console.log(doxname);

// Create an instance of an Express application
const app = express();

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create a MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Define a route handler for the root URL ('/')
app.get('/', function (req, res) {
  // Send the index.html file located in the "public" directory
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route to add a new user
app.post('/add-user', (req, res) => {
  const newUser = req.body;
  
  // SQL query to insert a new user into the database
  const query = `INSERT INTO ${process.env.DB_TABLE_NAME} (FirstName, LastName, Department, StartDate, EndDate, Salary, JobTitle) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    newUser.FirstName,
    newUser.LastName,
    newUser.Department,
    newUser.StartDate,
    newUser.EndDate,
    newUser.Salary,
    newUser.JobTitle
  ];

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Error adding user.');
      return;
    }
    console.log('New user added:', results.insertId);
    res.status(200).send('User added successfully.');
  });
});

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
  // Log a message indicating the server is running and on which port
  console.log(`Server is running on port ${PORT}`);
});
