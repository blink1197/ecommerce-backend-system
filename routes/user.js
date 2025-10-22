const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();


// Endpoints
router.post("/register", userController.registerUser);

//Login
router.post("/login", userController.login);

//Retrieve User Details
router.put('/details', verify, userController);


module.exports = router;