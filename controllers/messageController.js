const Message = require('../models/Message');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get messages for an event
// @route   GET /api/messages/:eventId
// @access  Private (requireAuth)
const getMessagesForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages
  });
});

// @desc    Send a message (also handled by Socket.io)
// @route   POST /api/messages
// @access  Private (requireAuth)
const sendMessage = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;
  const senderId = req.user._id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Create message in database
  const message = await Message.create({
    event: eventId,
    sender: senderId,
    text
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name email');

  // Emit via Socket.io
  const io = req.app.get('io');
  io.to(eventId).emit('new-message', populatedMessage);

  res.status(201).json({
    status: 'success',
    data: populatedMessage
  });
});

module.exports = {
  getMessagesForEvent,
  sendMessage
};
module.exports = { getMessagesForEvent, sendMessage };