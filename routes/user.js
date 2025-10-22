const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();


// Endpoints
router.post("/register", userController.registerUser);




module.exports = router;