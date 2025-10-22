const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin } = require('../auth');



const router = express.Router();


// Endpoints
router.post("/register", userController.registerUser);

//Login
router.post("/login", userController.loginUser);

//Retrieve User Details
router.get('/details', verify, userController.getUserdetails);

//Set as admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin);


module.exports = router;