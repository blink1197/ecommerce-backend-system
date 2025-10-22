const express = require('express');
const productController = require('../controllers/product');
const { verify, verifyAdmin } = require('../auth');


const router = express.Router();

// Create product
router.post("/", verify, verifyAdmin, productController.createProduct);

// Get all product
router.get("/all", verify, verifyAdmin, productController.getAllProduct);

//Get all active product
router.get("/active", productController.getAllActive);

//Get specific product
router.get("/:productId", productController.getProduct);


module.exports = router;
