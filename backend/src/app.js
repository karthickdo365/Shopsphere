require('express-async-errors'); // must be required before routes are used
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --- Core middleware ---
// crossOriginResourcePolicy relaxed so uploaded images can be loaded from the frontend's origin
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Basic rate limiting to protect auth endpoints from brute force
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);

// --- Serve uploaded images (e.g. http://localhost:5000/uploads/169...-photo.jpg) ---
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Swagger docs ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API routes ---
app.use('/api/v1', routes);

// --- Health check ---
app.get('/health', (req, res) => res.json({ success: true, message: 'ShopSphere API is running' }));

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Central error handler (must be last) ---
app.use(errorHandler);

module.exports = app;
