const express = require('express');
const orderController = require('../controllers/order');
const { verify, verifyAdmin } = require('../auth');

const router = express.Router();


// Create order
router.post('/checkout', verify, orderController.createOrder);

// Retrieve all orders
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders)

// Retrieve user's orders
router.get('/my-orders', verify, orderController.getUserOrders)

module.exports = router;