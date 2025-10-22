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
            .then(newProduct => {
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
