const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');


// Register User
module.exports.registerUser = (req, res) => {

	const { firstName, lastName, email, mobileNo, password } = req.body;

	if (!firstName || typeof firstName !== 'string' || !lastName || typeof lastName !== 'string' ) {
		return res.status(400).json({ error: 'Check the details and try again' });
	}

    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: 'Email invalid' });
    }

    if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ error: 'Mobile number invalid' });
    }
    
    if (req.body.password.length < 8) {
        return res.status(400).send({ error: 'Password must be atleast 8 characters long' });
    } 

    let newUser = new User({
        firstName : firstName,
        lastName : lastName,
        email : email,
        mobileNo : mobileNo,
        password : bcrypt.hashSync(password, 10)
    })

    return newUser.save()
    .then((user) => res.status(201).send({
        message: 'Registered Successfully',
    }))
    .catch(error => console.log(error));
};


// Login User
module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).send({ error: "Invalid Email" });
    }

    return User.findOne({ email: email })
    	.then((user) => {
    		// If no email found
    		if (!user) {
		        return res.status(404).send({ error: "No Email Found" });
		    }

		    // If passwords dont match
		    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
		    if (!isPasswordCorrect) {
		        return res.status(401).send({ error: "Email and password do not match" });
		    }

		    const accessToken = auth.createAccessToken(user);

		    return res.status(200).send({
		        access: accessToken
		    });

    	})
    	.catch(error => console.log(error))
};

// Retrieve User Details
module.exports.getUserdetails = (req, res) => {
    return User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(403).send({ error: "User not found" });
            } 

            // Convert Mongoose document to plain JS object
            const userWithoutPassword = user.toObject();

            // Remove the password property
            delete userWithoutPassword.password;

            return res.status(200).send({ user: userWithoutPassword });
        })
        .catch(error => console.log(error))
};	