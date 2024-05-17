// Import required modules
const express = require('express'); // Express framework for building web applications
const app = express(); // Initialize an Express application
const mysql = require('mysql2'); // MySQL module to interact with MySQL databases

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Retrieve environment variables
const doxname = process.env.SECRET_USER; // A secret user, possibly for demonstration
const PORT = process.env.PORT; // The port on which the server will listen

// Set up a connection to the MySQL database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USER, // Database user
  password: process.env.DB_PASSWORD, // Database user's password
  database: process.env.DB_NAME, // Name of the database
  tableName: process.env.DB_TABLE_NAME, // Name of the table
});

// Connect to the MySQL server
connection.connect(err => {
  if (err) throw err; // Throw an error if connection fails
  console.log('Connected to MySQL Server!'); // Log success message on successful connection
});

// Create user in database
connection.query(
  'INSERT INTO employees (FirstName, LastName, Department, Salary, JobTitle, StartDate, EndDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ['Anthony', 'Volatile', 'Engineering', '60000', 'Software Intern', '2023-02-22', '9999-12-31'], (err, results) => {
  if (err) {
    console.error('Error creating user:', err);
    return;
  }
  console.log('User created successfully!');
});








// // Employee data object to be inserted into the database
// const employee = {
//   FirstName: 'Anthony',
//   LastName: 'Volatile',
//   Department: 'Engineering',
//   JobTitle: 'Software Intern',
//   StartDate: '2022-01-01',
//   EndDate: null,
//   Salary: 50000
// };

// connection.query(`INSERT INTO ${process.env.DB_TABLE_NAME} SET ?`, employee, err => {
//   if (err) throw err; // Throw an error if query fails
//   console.log('1 record inserted'); // Log success message on successful insertion
//   res.send('Employee added successfully'); // Send a response to the client
  
// });















// // Define a route for the root URL
// app.get('/', function (req, res) {
//   // Destructure employee object to get individual properties
//   const { FirstName, LastName, Department, JobTitle, StartDate, EndDate, Salary } = employee;

//   // Insert the employee data into the specified table
//   connection.query(`INSERT INTO ${process.env.DB_TABLE_NAME} SET ?`, { FirstName, LastName, Department, JobTitle, StartDate, EndDate, Salary }, err => {
//     if (err) throw err; // Throw an error if query fails
//     console.log('1 record inserted'); // Log success message on successful insertion
//     res.send('Employee added successfully'); // Send a response to the client
//   });
// });

// // Define a route for adding an employee using a POST request
// app.post('/addemployee', (req, res) => {
//   // Destructure employee object to get individual properties
//   const { FirstName, LastName, Department, JobTitle, StartDate, EndDate, Salary } = employee;

//   // Insert the employee data into the 'employees' table
//   connection.query('INSERT INTO employees SET ?', { FirstName, LastName, Department, JobTitle, StartDate, EndDate, Salary }, err => {
//     if (err) throw err; // Throw an error if query fails
//     console.log('1 record inserted'); // Log success message on successful insertion
//     res.send('Employee added successfully'); // Send a response to the client
//   });
// });

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`); // Log message indicating server is running
  console.log(`Add user to database at http://localhost:${PORT}/addemployee`); // Log message indicating the URL to add an employee
});
