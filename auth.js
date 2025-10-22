const jwt = require("jsonwebtoken");

require('dotenv').config();




module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};


module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token === "undefined") {
		return res.status(401).send({ 
			auth: "Failed",
			message: "No Authorization Token"
		});
	} 

	token = token.slice(7, token.length);

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
		if (err) {
			return res.status(403).send({
				auth: "Failed",
				message: err.message
			});
		} 

		req.user = decodedToken;
		next();
	});
}


module.exports.verifyAdmin = (req, res, next) => {
	if (!req.user.isAdmin) {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		});
	} 

	next();
}