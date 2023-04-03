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
  const { email, password, passwordSecure } = req.body;

  if (email === "" || password === "" || passwordSecure === "") {
    res.status(400).json({ errorMessage: "All fields need to be filled" });
    return;
  }

  // password 1 === password 2
  if (password !== passwordSecure) {
    res
      .status(400)
      .json({ errorMessage: "Please make sure both passwords are the same" });
    return;
  }

  // Password security

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "The password should contain at least 6 characters, one uppercase letter and a number or special character",
    });
    return;
  }

  //valid email check
  const emailRegex =
    /[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (emailRegex.test(email) === false) {
    res
      .status(400)
      .json({ errorMessage: "The e-mail needs to be a valid direction" });
    return;
  }

  const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send("Error creating user");
      return;
    }

    res.send("User created successfully!");
  });
};
