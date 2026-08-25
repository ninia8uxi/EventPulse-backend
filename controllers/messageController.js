const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

const getMessagesForEvent = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ eventId: req.params.eventId });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getMessagesForEvent, sendMessage };