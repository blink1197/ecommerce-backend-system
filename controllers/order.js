const Order = require('../models/Order');
const Cart = require('../models/Cart');


module.exports.createOrder = (req, res) => {
	const userId = req.user.id;
	return Cart.findOne({ userId: userId})
		.then((cart) => {
			if (!cart) {
				return res.status(404).json({ message: "No cart found" });
			}

			if (cart.cartItems.length === 0) {
				return res.status(400).json({ message: "Cart is empty" });
			}

			// Compute total price 
			const totalPrice = cart.cartItems.reduce(
				(total, i) => total + i.subtotal,
				0
			);

			// Create order document
			const newOrder = new Order({
				userId: userId,
				productsOrdered: cart.cartItems,
				totalPrice: totalPrice,
			})

			return newOrder.save().then((order) => {
				return res.status(200).json({
					message:"Order created successfully",
					order,
				});
			});
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({
				error: "Server error while creating order",
				details: error,
			});
		});
}


module.exports.getAllOrders = (req, res) => {
	return Order.find({})
		.then((orders) => {
			if (orders.length === 0) {
				return res.status(404).json({
					message:"No orders found",
				});
			}

			return res.status(200).json({
				message:"Orders found",
				count: orders.length,
				orders,
			});
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({
				error: "Server error while retrieving orders",
				details: error,
			});
		});
}


module.exports.getUserOrders = (req, res) => {
	const userId = req.user.id;
	return Order.find({ userId: userId})
		.then((orders) => {
			if (orders.length === 0) {
				return res.status(404).json({
					message:"No orders found",
				});
			}

			return res.status(200).json({
				message:"Orders found",
				count: orders.length,
				orders,
			});
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({
				error: "Server error while retrieving user's orders",
				details: error,
			});
		});
}

