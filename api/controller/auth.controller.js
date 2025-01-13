const validator = require('validator');
const signUp = require('../services/auth.service');
const { sendError, sendSuccess } = require('../utils/respones');
const passport = require('../strategies/local');

const loginController = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return sendError(res, 500, 'An internal error occurred.');
        }
        if (!user) {
            return sendError(res, 401, 'Invalid email or password.');
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return sendError(res, 500, 'Login failed.');
            }
            return sendSuccess(res, 'Login successful!', {
                ...user._doc,
                password: undefined,
            });
        });
    })(req, res, next);
}

const signUpController = async (req, res) => {
    try {
        const { email, password ,name} = req.body;

        if (!email || !password || !name) {
            return sendError(res, 400, 'All fields are required');
        }

        if (!validator.isEmail(email)) {
            return sendError(res, 400, 'Invalid email');
        }

        if (!validator.isStrongPassword(password)) {
            return sendError(res, 400, 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character');
        }
        
        const user = await signUp(({email, password,name}));
        return sendSuccess(res, 'User created successfully', {
            ...user._doc,
            password: undefined
        }
        );
    } catch (err) {
        console.log(err)
        if (err.code === 11000 || err.code === 11001) { 
            return sendError(res, 409, 'Email already exists');
        }
        if (process.env.NODE_ENV === 'production') {
            return sendError(res, 500, 'Something went wrong');
        } else {
            return sendError(res, 500, err.message);
        }
    }
}

const logoutController = async (req, res) => {
    req.logout();
    return sendSuccess(res, 'Logged out successfully');
}

const sessionController = async (req, res) => {
    if (req.isAuthenticated()) {
        return sendSuccess(res, 'User is logged in', {
            ...req.user._doc,
            password: undefined
        });
    } else {
        return sendError(res, 401, 'User is not logged in');
    }
}

module.exports = {
    signUpController,
    loginController,
    logoutController,
    sessionController
}