const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
// ============================================
// 🧪 TEST ROUTES – placed first to ensure they work
// ============================================
console.log('✅ Server.js is loading...');

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Test route works!' });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
app.use(express.json());
app.use(morgan('dev'));

// ✅ HEALTH ROUTE – مباشر وأول حاجة
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.send('EventPulse API is Running!'));

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// ============================================
// ERROR HANDLERS
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
// EXPORT for Vercel
// ============================================
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;