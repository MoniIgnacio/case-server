const conn = require("../db/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res) => {
  const { userEmail } = req.params;
  if (userEmail === ":userEmail") {
    res.status(400).json({ errorMessage: "The fields need to be filled" });
    return;
  }

  const query = `SELECT email, id FROM users WHERE email='${userEmail}';`;

  conn.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      res.status(500).send("Error getting user");
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

  try {
    // Generate validate password
    // const salt = await bcrypt.genSalt(12);
    // const hashPassword = await bcrypt.hash(password, salt);

    //check that the email hast not been used
    const preQuery = `SELECT * FROM users WHERE email='${email}'`;
    const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

    conn.query(preQuery, (_, result) => {
      result.length !== 0
        ? res
            .status(400)
            .json({ errorMessage: "That e-mail is already in use" })
        : conn.query(query, (_, result) => {
            res.status(200).json("User created successfully!");
          });
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  //BE validations
  //All fields are filled
  if (email === "" || password === "") {
    res.status(400).json({ errorMessage: "Invalid credentials" });
    return;
  }

  try {
    //User exists
    const preQuery = `SELECT * FROM users WHERE email='${email}'`;

    conn.query(preQuery, async (_, result) => {
      if (result.length === 0) {
        res.status(400).json({ errorMessage: "Invalid credentials" });
        return;
      }

      try {
        //Correct password
        let passwordFounded = result[0].password;
        // const isPasswordValid = await bcrypt.compare(password, passwordFounded);
        // console.log(isPasswordValid)
        // if (isPasswordValid === false) {
        if (password !== passwordFounded) {
          res.status(400).json({ errorMessage: "Invalid credentials" });
          return;
        }

        // Token creation and send it to client
        const payload = {
          _id: result[0].id,
          email: result[0].email,
        };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "3h",
        });
        // send the token to the client
        res.status(200).json({ authToken: authToken });
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res) => {
  res.status(200).json({ user: req.payload });
};
