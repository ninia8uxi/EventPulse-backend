const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private (requireAuth)
const registerForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  // 1) Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // 2) Check if event is in the past
  if (new Date(event.date) < new Date()) {
    return next(new AppError('Cannot register for past events', 400));
  }

  // 3) Check capacity
  const registeredCount = await Registration.countDocuments({ event: eventId });
  if (registeredCount >= event.capacity) {
    return next(new AppError('Event is fully booked', 400));
  }

  // 4) Check if user already registered (double registration prevention)
  const existingRegistration = await Registration.findOne({
    event: eventId,
    attendee: userId
  });
  if (existingRegistration) {
    return next(new AppError('You are already registered for this event', 400));
  }

  // 5) Create registration
  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
    status: 'confirmed'
  });

  // 6) Populate for response
  const populatedRegistration = await Registration.findById(registration._id)
    .populate('event')
    .populate('attendee', '-password');

  res.status(201).json({
    status: 'success',
    data: populatedRegistration
  });
});

// @desc    Get my registrations (logged-in user)
// @route   GET /api/registrations
// @access  Private (requireAuth)
const getMyRegistrations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Optional query params for filtering
  const queryObj = { attendee: userId };
  
  // Filter by status if provided
  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  const registrations = await Registration.find(queryObj)
    .populate({
      path: 'event',
      populate: [
        { path: 'category' },
        { path: 'organizer', select: '-password' }
      ]
    })
    .sort({ registeredAt: -1 }); // newest first

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations
  });
});

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
// @access  Private (requireAuth)
const cancelRegistration = asyncHandler(async (req, res, next) => {
  const registrationId = req.params.id;
  const userId = req.user._id;

  // 1) Find registration and ensure it belongs to the user
  const registration = await Registration.findOne({
    _id: registrationId,
    attendee: userId
  });

  if (!registration) {
    return next(new AppError('Registration not found or you do not have permission', 404));
  }

  // 2) Check if event is already past
  const event = await Event.findById(registration.event);
  if (new Date(event.date) < new Date()) {
    return next(new AppError('Cannot cancel registration for past events', 400));
  }

  // 3) Delete registration
  await registration.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Admin: Get all registrations (optional)
// @route   GET /api/registrations/admin/all
// @access  Private (Admin only)
const getAllRegistrations = asyncHandler(async (req, res, next) => {
  const registrations = await Registration.find()
    .populate('event')
    .populate('attendee', '-password')
    .sort({ registeredAt: -1 });

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations
  });
});

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAllRegistrations
};
module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getAllRegistrations };