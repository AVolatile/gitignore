// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

// Set up a connection to the MySQL database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the MySQL server
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

// Initialize an Express application
const app = express();

// Middleware to parse URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Retrieve environment variables
const PORT = process.env.PORT || 3000;

// Route to handle employee creation
app.post('/createUser', (req, res) => {
  const { FirstName, LastName, Department, StartDate, EndDate, Salary, JobTitle, UserName, Email, Password } = req.body;

  const userDetails = {
    FirstName: FirstName,
    LastName: LastName,
    Department: Department,
    StartDate: StartDate,
    EndDate: EndDate,
    Salary: Salary,
    JobTitle: JobTitle,
    UserName: UserName,
    Email: Email,
    Password: Password
  };

  connection.query('INSERT INTO employees SET ?', userDetails, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data into database');
    } else {
      res.status(200).send('Data inserted successfully');
    }
  });
});

// Route to handle login creation (used to modify the table)
app.post('/createLogin', (req, res) => {
  const { UserName, Email, Password } = req.body;

  const userDetails = {
    UserName: UserName,
    Email: Email,
    Password: Password
  };

  connection.query('INSERT INTO users SET ?', userDetails, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data into database');
    } else {
      res.status(200).send('Data inserted successfully');
    }
  });
});

// Route to handle user login
app.post('/login', (req, res) => {
  const { loginUsername, loginPassword } = req.body;
console.log(req.body)

  // Query the database to check if the username and password exist
  connection.query('SELECT * FROM employees WHERE UserName = ? AND Password = ?', [loginUsername, loginPassword], (err, results) => {
    if (err) {
      console.error('Error checking login credentials:', err); // Log detailed error message
      res.status(500).send('Error checking login credentials');
    } else {
      if (results.length > 0) {
        // User found, authentication successful
        res.status(200).send('Login successful');
      } else {
        // No matching user found, authentication failed
        res.status(401).send('Invalid username or password');
      }
    }
  });
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
