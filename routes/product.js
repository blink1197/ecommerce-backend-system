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

//Product Update
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//Product Archive
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//Product Activate
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

//Search Product by Name
router.post("/search-by-name", productController.searchProductByName);

//Search by Price
router.post("/search-by-price", productController.searchProductByPriceRange);


module.exports = router;
