const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.send('EventPulse API is Running!'));
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health check works from server.js' });
});

// ============================================
// ROUTES – each registered ONCE
// ============================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/health', require('./routes/healthRoutes'));   // ✅ only once

// ============================================
// ERROR HANDLERS – MUST come after all routes
// ============================================
const AppError = require('./utils/AppError');

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

// ============================================
// EXPORT for Vercel (no app.listen on Vercel)
// ============================================
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;