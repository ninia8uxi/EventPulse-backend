const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.send('EventPulse API is Running!'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

const AppError = require('./utils/AppError');

app.all('*', (req, res, next) => {
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
module.exports = app;