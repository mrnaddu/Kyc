const express = require('express');
const logger = require('./middleware/logger');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(securityMiddleware.helmet);
app.use(securityMiddleware.cors);
app.use(securityMiddleware.rateLimit);
app.use(express.json());
app.use(express.static(require('path').join(__dirname, 'public')));

// Routes
app.use('/api/rc', require('./routes/rcRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/kyc', require('./routes/kycRoutes'));

// Centralized error handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});