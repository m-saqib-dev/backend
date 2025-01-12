const validator = require('validator');
const signUp = require('../services/auth.service');

const signUpController = async (req, res) => {
    try {
        const { email, password ,first_name, last_name} = req.body;

        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ error: "Email, password, first name, and last name are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Password is not strong enough" });
        }
        
        const user = await signUp(({email, password,first_name,last_name}));
        res.status(201).json({success:true, message: "Registration successful", user });
    } catch (err) {
        // console.log(err)
        if (err.code === 11000 || err.code === 11001) { 
            return res.status(400).json({ error: "Email already exists" });
        }
        if (process.env.NODE_ENV === 'production') {
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = signUpController;