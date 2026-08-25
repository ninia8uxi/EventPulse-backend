
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');


dotenv.config();


const connectDB = require('./config/db');
connectDB();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);


io.on('connection', (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  socket.on('join-event', (eventId) => {
    socket.join(eventId);
    console.log(`📢 Socket ${socket.id} joined room: ${eventId}`);
    socket.emit('joined-event', { eventId, message: 'Successfully joined event room' });
  });


  socket.on('send-message', async (data) => {
    const { eventId, senderId, text } = data;

    io.to(eventId).emit('new-message', {
      eventId,
      senderId,
      text,
      sentAt: new Date()
    });
  });

  socket.on('leave-event', (eventId) => {
    socket.leave(eventId);
    console.log(`📢 Socket ${socket.id} left room: ${eventId}`);
  });


  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());


app.use(express.static(path.join(__dirname, 'public')));


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


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 Socket.io ready for real‑time connections`);
  });
}

module.exports = app;