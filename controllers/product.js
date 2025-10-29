const Product = require('../models/Product');


// Create product
module.exports.createProduct = (req, res) => {
	const { name, price, description } = req.body;
	let newProduct = new Product({
        name : name,
        description : description,
        price : price
    });

	return Product.findOne({ name: name })
		.then((product) => {
			if (product) {
	            return res.status(409).send({ message: 'Product already exists' });
	        }

	        return newProduct.save()
            .then((newProduct) => {
            	const newProductObject = newProduct.toObject();
            	return res.status(201).send(newProductObject)
            })
		})
		.catch((error) => {
        	console.error(error);
	        return res.status(500).json({
	            error: "Failed in Find",
	            details: error
	        });
	    });
}


// Get all Products
module.exports.getAllProduct = (req, res) => {
    return Product.find({})
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
};

// Get all active product
module.exports.getAllActive = (req, res) => {
    return Product.find({ isActive: true })
        .then((result) => {
            return res.status(200).send(result); 
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
};

// Get Product 
module.exports.getProduct = (req, res) => {
    const productId = req.params.productId
    return Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).send({ error: 'Product not found'});
            }

            return res.status(200).send(product);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
}

// Update product
module.exports.updateProduct = (req, res) => {
	const { name, price, description } = req.body;
	const productId = req.params.productId;
	let updatedProduct = {
        name: name,
        description: description,
        price: price
    }

    return Product.findByIdAndUpdate(productId, updatedProduct)
    	.then((product) => {
    		if (!product) {
    			return res.status(404).send({ message: 'Product not found' });
    		} 

    		return res.status(200).send({ 
				success: true, 
				message: 'Product updated successfully' 
			});
    	})
    	.catch((error) => {
        	console.error(error);
	        return res.status(500).json({
	            error: "Failed in Find",
	            details: error
	        });
	    });
}


// Archive product
module.exports.archiveProduct = (req, res) => {
	const productId = req.params.productId;
	let updateActiveField = {
        isActive: false
    }

    return Product.findByIdAndUpdate(productId, updateActiveField)
    	.then((product) => {
    		if (!product) {
    			return res.status(404).send({ message: 'Product not found' });
    		} 

    		if (!product.isActive) {
                return res.status(200).send({ 
                    message: 'Product already archived',
                    archivedProduct: product
                });
            }

            return res.status(200).send({ 
                success: true, 
                message: 'Product archived successfully'
            });
    	})
    	.catch((error) => {
        	console.error(error);
	        return res.status(500).json({
	            error: "Failed in Find",
	            details: error
	        });
	    });
}


// Activate product
module.exports.activateProduct = (req, res) => {
	const productId = req.params.productId;
	let updateActiveField = {
        isActive: true
    }

    return Product.findByIdAndUpdate(productId, updateActiveField)
    	.then((product) => {
    		if (!product) {
    			return res.status(404).send({ message: 'Product not found' });
    		} 

    		if (product.isActive) {
                return res.status(200).send({ 
                    message: 'Product already activated',
                    activateProduct: product
                });
            }

            return res.status(200).send({ 
                success: true, 
                message: 'Product activated successfully'
            });
    	})
    	.catch((error) => {
        	console.error(error);
	        return res.status(500).json({
	            error: "Failed in Find",
	            details: error
	        });
	    });
}


// Search product by name
module.exports.searchProductByName = (req, res) => {
	const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: 'Course name is required.' });
    }

    // Use case-insensitive regex to match partial names
    return Product.find({ name: { $regex: name, $options: 'i' }, isActive: true })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).send({ message: 'No products found.' });
            }

            return res.status(200).json({
                success: true,
                products
            });
        })
        .catch((error) => {
        	console.error(error);
	        return res.status(500).json({
	            error: "Failed in Find",
	            details: error
	        });
	    });
} 


// Search product by price range
module.exports.searchProductByPriceRange = (req, res) => {
    const { minPrice, maxPrice } = req.body;

    // Validate inputs
    if (minPrice == null || maxPrice == null) {
        return res.status(400).json({
            message: "Both minPrice and maxPrice are required"
        });
    }

    // Find courses within price range
    return Product.find({
        price: { $gte: minPrice, $lte: maxPrice },
        isActive: true
    })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).json({
                    message: "No products found within this price range"
                });
            }

            return res.status(200).json({
                message: "Products found",
                products: products
            });
        })
        .catch((error) => {
        	console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
};