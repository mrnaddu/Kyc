const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
};

module.exports = errorHandler;