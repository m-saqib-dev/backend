const {signUpController, loginController, logoutController, sessionController} = require('../controller/auth.controller');
const { validateLogin } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/limiter');
const express = require('express');
const router = express();

router.post('/signup',signUpController)

router.post('/login',loginLimiter, validateLogin,loginController)

router.get('/session',sessionController);

router.post('/logout', logoutController);

module.exports = router
