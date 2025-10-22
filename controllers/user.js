const User = require('../models/User');
const bcrypt = require('bcryptjs');


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
    .catch((error) => {
        console.error(error);
        return res.status(500).json({
            error: "Failed in save",
            details: error
        });
    });
};




































// Set user as admin
module.exports.updateAdmin = (req, res) => {
    const userId = req.params.id;

    // Check if user exists
    return User.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            // Check if already admin
            if (user.isAdmin) {
                return res.status(200).json({
                    message: "User is already an admin"
                });
            }

            // Update user to admin
            user.isAdmin = true;
            return user.save()
                .then(() => {
                    return res.status(200).json({
                        updatedUser: user
                    });
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
