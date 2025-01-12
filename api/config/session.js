const session = require('express-session');

const sessionConfig = {
  secret: process.env.SESSION_SECRET, // Load secret from environment variable
  resave: false, 
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    sameSite: 'strict', 
  },
};

module.exports = sessionConfig;