const router = require("express").Router();
const conn = require("../db/index.js");

// POST '/user/' => Create a new user
router.post('/', (req, res) => {
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


module.exports = router;
