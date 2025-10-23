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

    return User.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' }); // 409 Conflict
            }

            // ✅ Create new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                mobileNo,
                password: bcrypt.hashSync(password, 10)
            });

            return newUser.save()
                .then(() => {
                    return res.status(201).send({ message: 'Registered Successfully' });
                });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed to register user",
                details: error.message
            });
        });
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
    	.catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
                details: error
            });
        });
};


// Retrieve User Details
module.exports.getUserdetails = (req, res) => {
    return User.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            } 

            // Convert Mongoose document to plain JS object
            const userWithoutPassword = user.toObject();

            // Remove the password property
            delete userWithoutPassword.password;

            return res.status(200).send({ user: userWithoutPassword });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed in Find",
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


// Update password
module.exports.updatePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters long" });
    }

    User.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Check if current password matches
            const isMatch = bcrypt.compareSync(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }

            // Update password if match
            user.password = bcrypt.hashSync(newPassword, 10);

            return user.save()
                .then(() => res.status(200).json({ message: "Password updated successfully" }));
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                error: "Failed to update password",
                details: error.message
            });
        });
};


