const validator = require('validator')
const requireLogin = (req, res, next) => {
    if (req.session.user) { // Check if req.session.user exists
        next(); // User is logged in, proceed
    } else {
        return res.status(401).json({ success: false, message: 'Unauthorized' }); // Or redirect to login
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