const Cart = require('../models/Cart');


module.exports.getCart = (req, res) => {
	const userId = req.user.id;
    return Cart.find({ userId: userId })
        .then((cart) => {

        	if (cart.length === 0) {
        		return res.status(404).send({ error: "No Cart Found" })
        	}

            return res.status(200).send(cart); 
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
}

module.exports.addToCart = (req, res) => {
	try {
		const { productId, quantity, price, subtotal } = req.body;
		const { id: userId, isAdmin } = req.user;

		if (isAdmin) return res.status(403).send({ error: "Admin not allowed" });

		return Cart.findOne({ userId })
			.then((cart) => {
				// If no cart yet
				if (!cart) {
					const newCart = new Cart({
						userId,
						cartItems: [{ productId, quantity, subtotal }],
						totalPrice: subtotal,
					});
					return newCart.save()
						.then((newCart) => {
							return res.status(201).send({
								message: "Item added to cart successfully",
								updatedCart: newCart,
							});
						})
				}

				// If cart exists
				const productExists = cart.cartItems.some(
					(item) => item.productId.toString() === productId.toString()
				);

				if (productExists) {
					cart.cartItems = cart.cartItems.map((item) => {
						if (item.productId.toString() === productId.toString()) {
							item.quantity += quantity;
							item.subtotal += subtotal;
						}
						return item;
					});
				} else {
					cart.cartItems.push({ productId, quantity, subtotal });
				}

				cart.totalPrice = cart.cartItems.reduce(
					(total, item) => total + item.subtotal,
					0
				);

				return cart.save()
					.then((newCart) => {
						return res.status(200).send({
							message: productExists ? "Item quantity updated successfully" : "Item added to cart successfully",
							updatedCart: cart,
						});
					})
			})
		
	} catch (error) {
		console.error("Error adding to cart:", error);
		return res.status(500).send({
			error: "Server error while adding to cart",
			details: error.message,
		});
	}
};