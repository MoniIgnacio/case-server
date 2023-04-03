const conn = require("../db/index.js");

exports.getAllUsers = async (req, res) => {
  const query = `SELECT * FROM users`;

  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send("Error getting users");
      return;
    }

    res.send(result);
  });
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send("Error creating user");
      return;
    }

    res.send("User created successfully!");
  });
};
