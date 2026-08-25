const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  eventQueryValidation
} = require('../validators/eventValidators');
const validate = require('../middleware/validationHandler');

// Public routes
router.get('/', eventQueryValidation, validate, getEvents);
router.get('/:id', eventIdValidation, validate, getEvent);

// Admin-only routes
router.post(
  '/',
  requireAuth,
  requireRole(['admin']),
  createEventValidation,
  validate,
  createEvent
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  updateEventValidation,
  validate,
  updateEvent
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin']),
  eventIdValidation,
  validate,
  deleteEvent
);

module.exports = router;