const { body, param } = require('express-validator');

const sendMessageValidation = [
  body('eventId')
    .isMongoId().withMessage('Event ID must be valid'),
  body('text')
    .notEmpty().withMessage('Message text is required')
    .isLength({ min: 1 }).withMessage('Message must not be empty')
];

const getMessagesValidation = [
  param('eventId')
    .isMongoId().withMessage('Invalid event ID')
];

module.exports = { sendMessageValidation, getMessagesValidation };