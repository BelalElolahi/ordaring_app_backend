const router = require('express').Router();

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    try {
        // Get user input
        const { name, email, password } = req.body;

        // validate user input
        if (!(name && email && password)) {
            res.status(400).send("All input is reequired");
        }

        //check if the user already exist 
        // validate if the user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send('User Already Exist. Please Login');
        }

        // Encrypt user password 
        encryptedPassword = await bcrypt.hash(password, 10);

        //Create user in our DB 
        const newUser = new User({
            name: name,
            email: email,
            password: encryptedPassword,
        });
        await newUser.save();
        return res.status(201).send("User Registered Successfully");

    } catch (error) {

        return res.status(400).json({ message: error.message });

    }

})


router.post('/login', async (req, res) => {

    try {
        //Get the user input 
        const { email, password } = req.body;

        //Validate user input 
        if (!(email && password)) {
            return res.status(400).send("Alll input is required");
        }

        //Validate if the user exist in our DB 
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            //Create a token 
            const token = jwt.sign(
                {
                    user_id: user._id,
                    name: user.name,
                    email: email,
                    isAdmin: user.isAdmin
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            );

            //Token
            return res.status(200).json({ token: token });

        }

        res.status(400).send("Invalid Credentials")

    } catch (error) {
        res.status(400).json({ message: error.message });

    }

})

module.exports = router