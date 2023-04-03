const router = require("express").Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

// GET '/user' => Get all users
router.get("/", userController.getAllUsers);

// POST '/user/create' => Create a new user
router.post("/create", userController.createUser);

// GET '/user/login' => Validate user credentials
router.get('/login', userController.loginUser);

// GET '/user/verify' => Send to Front End the verification of the token
router.get('/vefiry', isAuthenticated, userController.verifyUser);

// `DELETE FROM users WHERE id='${id}';`
module.exports = router;
