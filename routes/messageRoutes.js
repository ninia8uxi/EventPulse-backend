const express = require('express');
const router = express.Router();
const {
  getMessagesForEvent,
  sendMessage
} = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');
const { sendMessageValidation, getMessagesValidation } = require('../validators/messageValidators');
const validate = require('../middleware/validationHandler');

router.use(requireAuth);

router.get('/:eventId', getMessagesValidation, validate, getMessagesForEvent);
router.post('/', sendMessageValidation, validate, sendMessage);

module.exports = router;