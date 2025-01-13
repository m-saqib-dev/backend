const validator = require('validator');
const { sendError, sendSuccess } = require('../utils/respones');
const requireLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        sendSuccess(res, 'User is logged in', {
            ...req.user._doc,
            password: undefined
        });
        next();
    } else {
        return sendError(res, 401, 'User is not logged in');
    }
};
function redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home'); // Redirect to home if already logged in
    }
    next();
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    next(); // If validation passes, proceed to authentication
};

module.exports = { requireLogin, validateLogin, redirectIfAuthenticated }