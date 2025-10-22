const express = require('express');
const productController = require('../controllers/product');
const { verify, verifyAdmin } = require('../auth');


const router = express.Router();

// Create product
router.post("/", verify, verifyAdmin, productController.createProduct);

router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

module.exports = router;
