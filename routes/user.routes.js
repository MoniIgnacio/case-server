const router = require("express").Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth.middlewares");

// GET '/user/:userEmail' => Get especific user
router.get("/:userEmail", isAuthenticated , userController.getUser);

// POST '/user/create' => Create a new user
router.post("/create", userController.createUser);

// POST '/user/login' => Validate user credentials
router.post('/login', userController.loginUser);

// GET '/user/verify' => Send to Front End the verification of the token
router.get('/auth/verify', isAuthenticated, userController.verifyUser);

// `DELETE FROM users WHERE id='${id}';` --> PENDING
module.exports = router;
