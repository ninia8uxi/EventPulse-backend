const { body, param, query } = require('express-validator');

const createEventValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO date (YYYY-MM-DD)')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('city')
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('City must not exceed 50 characters'),
  
  body('venue')
    .notEmpty().withMessage('Venue is required')
    .isLength({ min: 2 }).withMessage('Venue must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Venue must not exceed 100 characters'),
  
  body('capacity')
    .notEmpty().withMessage('Capacity is required')
    .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be between 1 and 10,000')
    .custom((value) => {
      if (!Number.isInteger(value)) {
        throw new Error('Capacity must be an integer');
      }
      return true;
    }),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid MongoDB ObjectId')
];

const updateEventValidation = [
  param('id')
    .isMongoId().withMessage('Invalid event ID'),
  
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title must not exceed 100 characters'),
  
  body('description')
    .optional()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO date (YYYY-MM-DD)')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('city')
    .optional()
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('City must not exceed 50 characters'),
  
  body('venue')
    .optional()
    .isLength({ min: 2 }).withMessage('Venue must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Venue must not exceed 100 characters'),
  
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Capacity must be between 1 and 10,000'),
  
  body('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid MongoDB ObjectId')
];

const eventIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid event ID')
];

const eventQueryValidation = [
  query('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid MongoDB ObjectId'),
  
  query('city')
    .optional()
    .isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  
  query('search')
    .optional()
    .isLength({ min: 1 }).withMessage('Search term must not be empty'),
  
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO date'),
  
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO date')
    .custom((value, { req }) => {
      if (req.query.startDate) {
        const start = new Date(req.query.startDate);
        const end = new Date(value);
        if (end < start) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .custom((value) => {
      const allowedFields = ['title', 'date', 'city', 'capacity', 'createdAt', '-title', '-date', '-city', '-capacity', '-createdAt'];
      const fields = value.split(',');
      const allValid = fields.every(field => allowedFields.includes(field));
      if (!allValid) {
        throw new Error('Invalid sort field. Allowed: title, date, city, capacity, createdAt');
      }
      return true;
    })
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  eventQueryValidation
};