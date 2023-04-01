const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require("mysql");

const app = express();
 
app.use(cors());
// parse application/json
app.use(bodyParser.json());
  
//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'case'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
 
//add new user
app.post('/users', (req, res) => {
    const { username, password } = req.body;
  
    const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
  
    conn.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Error creating user');
        return;
      }
  
      res.send('User created successfully!');
    });
  });
 
app.listen(3000, () => {
  console.log("Server running successfully on 3000");
});