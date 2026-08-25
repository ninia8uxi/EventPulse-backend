const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/auth');
const { registerValidation, cancelValidation } = require('../validators/registrationValidators');
const validate = require('../middleware/validationHandler');

router.use(requireAuth);

router.post('/', registerValidation, validate, registerForEvent);
router.get('/', getMyRegistrations);
router.delete('/:id', cancelValidation, validate, cancelRegistration);

module.exports = router;