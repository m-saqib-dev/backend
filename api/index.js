const express = require('express');
const connectDB = require('./database');
const authRouterV2 = require('./routes/authRoutes')

const session = require('express-session');
const path = require('path');
const cors = require('cors');
const passport = require('./strategies/local');
const helmet = require('helmet');
const {limiter} = require('./middleware/limiter');

const MongoStore = require('connect-mongo');
const { mongo } = require('mongoose');
require('dotenv').config();

const app = express();
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
})

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(limiter);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    cookie: {
        maxAge: 30000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection
connectDB();

// Routes
// app.use('/', viewsRouter);
app.use('/api/v2/',authRouterV2)

app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack for debugging
    res.status(500).json({ error: err.message || 'Something went wrong!' }); // Send the error message
});
// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
