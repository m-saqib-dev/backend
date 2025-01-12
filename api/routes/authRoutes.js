const signUpController = require('../controller/auth.controller');
const { validateLogin, redirectIfAuthenticated } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/limiter');
const passport = require('../strategies/local')
const express = require('express')
const router = express();

router.post('/signup',signUpController)

router.post('/login',loginLimiter, validateLogin,(req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'An internal error occurred.' });
        }
        if (!user) {
            return res.status(400).json({ error: info.message }); 
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return res.status(500).json({ error: 'Login failed.' });
            }
            return res.status(200).json({success:true , message: 'Login successful!', user:{
                ...user._doc,
                password:undefined
            } });
        });
    })(req, res, next)}
)

router.get('/session', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ loggedIn: true, user: req.user });
    } else {
        return res.status(401).json({ loggedIn: false });
    }
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        req.session.destroy(() => {
            res.status(200).json({ message: 'Logged out successfully.' });
        });
    });
});

module.exports = router
