const Cart = require('../models/Cart');
const Product = require('../models/Product');


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
		.catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
		
};


module.exports.updateCartQuantity = (req, res) => {
	const { productId, newQuantity } = req.body;
	const { id: userId, isAdmin } = req.user;

	if (isAdmin) return res.status(403).json({ error: "Admin not allowed" });

	Product.findById(productId)
		.then((product) => {
			if (!product)
				return res.status(404).json({ message: "Product not found" });

			const productPrice = product.price;

			return Cart.findOne({ userId }).then((cart) => {
				if (!cart)
					return res.status(404).json({ message: "No cart found" });

				const itemIndex = cart.cartItems.findIndex(
					(i) => i.productId.toString() === productId.toString()
				);

				if (itemIndex === -1)
					return res.status(404).json({ message: "Item not found in the cart" });

				// Update quantity & subtotal
				const item = cart.cartItems[itemIndex];
				item.quantity = newQuantity;
				item.subtotal = productPrice * newQuantity;

				// Recalculate total price
				cart.totalPrice = cart.cartItems.reduce(
					(total, i) => total + i.subtotal,
					0
				);

				return cart.save().then((updatedCart) => {
					return res.status(200).json({
						message:
							newQuantity <= 0
								? "Item removed from cart successfully"
								: "Item quantity updated successfully",
						updatedCart,
					});
				});
			});
		})
		.catch((error) => {
			console.error("Error updating cart quantity:", error);
			return res.status(500).json({
				error: "Server error while updating cart quantity",
				details: error.message,
			});
		});
};

//Clear Cart
module.exports.removeFromCart = (req, res) => {
  const userId = req.user.id;

  Cart.findOne({ userId: userId })
    .then(cart => {

      if (!cart) {
        return res.status(404).send({
          message: "No cart found for this user."
        });
      }

      if (!cart.cartItems || cart.cartItems.length === 0) {
        return res.status(400).send({
          message: "Cart is already empty."
        });
      }

      cart.cartItems = [];
      cart.totalPrice = 0;

      cart.save()
        .then(updatedCart => {
          return res.status(200).send({
            message: "Cart cleared successfully",
            cart: updatedCart
          });
        })

        .catch(error => {
          return res.status(500).send(error);
        })
    })

    .catch(error => {
      return res.status(500).send(error);
    });
};
