const router = require("express").Router();
const userController = require("../controllers/userController");

// GET '/user' => Get all users
router.get("/", userController.getAllUsers);

// POST '/user/create' => Create a new user
router.post("/create", userController.createUser);

// `DELETE FROM users WHERE id='${id}';`
// `SELECT * FROM users ORDER BY username;`
module.exports = router;
