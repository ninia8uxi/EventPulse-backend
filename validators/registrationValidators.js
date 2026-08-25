const { body, param } = require('express-validator');

const registerValidation = [
  body('eventId')
    .isMongoId().withMessage('Event ID must be valid')
];

const cancelValidation = [
  param('id')
    .isMongoId().withMessage('Invalid registration ID')
];

module.exports = { registerValidation, cancelValidation };