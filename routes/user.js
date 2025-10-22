const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin } = require('../auth');



const router = express.Router();


// Register
router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Retrieve User Details
router.get('/details', verify, userController.getUserdetails);

// Set user as admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin);

// Update password
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;