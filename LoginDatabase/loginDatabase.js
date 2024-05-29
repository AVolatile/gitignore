const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change to true in production with HTTPS
}));

const PORT = process.env.PORT || 3000;

app.post('/createUser', async (req, res) => {
  const { FirstName, LastName, Department, StartDate, EndDate, Salary, JobTitle, Username, Password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const userDetails = {
      FirstName,
      LastName,
      Department,
      StartDate,
      EndDate,
      Salary,
      JobTitle,
      Username,
      Password: hashedPassword
    };

    connection.query('INSERT INTO employees SET ?', userDetails, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting data into database');
      }
      res.status(200).send('User added successfully');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', (req, res) => {
  const { Username, Password } = req.body;

  connection.query('SELECT * FROM employees WHERE Username = ?', [Username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error during login');
    }

    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(Password, user.Password);
      if (match) {
        req.session.userId = user.id;
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
