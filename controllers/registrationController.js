const Registration = require('../models/Registration');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const registerForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user._id;


  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  
  if (new Date(event.date) < new Date()) {
    return next(new AppError('Cannot register for past events', 400));
  }

  const registeredCount = await Registration.countDocuments({ event: eventId });
  if (registeredCount >= event.capacity) {
    return next(new AppError('Event is fully booked', 400));
  }

  const existingRegistration = await Registration.findOne({
    event: eventId,
    attendee: userId
  });
  if (existingRegistration) {
    return next(new AppError('You are already registered for this event', 400));
  }


  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
    status: 'confirmed'
  });

  const populatedRegistration = await Registration.findById(registration._id)
    .populate('event')
    .populate('attendee', '-password');

  res.status(201).json({
    status: 'success',
    data: populatedRegistration
  });
});


const getMyRegistrations = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;


  const queryObj = { attendee: userId };
 
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
    .sort({ registeredAt: -1 }); 

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations
  });
});


const cancelRegistration = asyncHandler(async (req, res, next) => {
  const registrationId = req.params.id;
  const userId = req.user._id;


  const registration = await Registration.findOne({
    _id: registrationId,
    attendee: userId
  });

  if (!registration) {
    return next(new AppError('Registration not found or you do not have permission', 404));
  }


  const event = await Event.findById(registration.event);
  if (new Date(event.date) < new Date()) {
    return next(new AppError('Cannot cancel registration for past events', 400));
  }


  await registration.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

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