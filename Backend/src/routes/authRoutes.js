const express = require("express");
const { registerUser, loginUser, getCurrentUser } = require("../controllers/authController.js");
const  verifyJWT  =  require("../middleware/authMiddleware.js")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current-user", verifyJWT, getCurrentUser);

module.exports = router;