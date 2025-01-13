// utils/response.js

// Helper for sending error responses
const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

// Helper for sending success responses
const sendSuccess = (res, message, data = {}) => {
    res.status(200).json({
        success: true,
        message,
        data,
    });
};

module.exports = {
    sendError,
    sendSuccess,
};
