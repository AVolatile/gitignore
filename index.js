require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const doxname = process.env.SECRET_USER;
const PORT = process.env.PORT || 3000;

console.log(doxname);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/add-user', (req, res) => {
  const { username, email } = req.body;
  const query = 'INSERT INTO yourDBtablename (username, email) VALUES (?, ?)';
  const values = [username, email];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Error adding user.');
      return;
    }
    res.status(200).send('User added successfully.');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
