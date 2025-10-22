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
    .catch(error => console.log(error));
};