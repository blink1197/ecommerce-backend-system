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
};