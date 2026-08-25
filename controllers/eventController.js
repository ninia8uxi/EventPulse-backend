const Event = require('../models/Event');
const Category = require('../models/Category');
const Registration = require('../models/Registration');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all events with filtering, pagination, search, sorting
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res, next) => {
  try {
    // 1) Build query object
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 2) Filtering (by category, city, date range)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const filter = JSON.parse(queryStr);

    // 3) Search (case-insensitive)
    let searchFilter = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      searchFilter = {
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      };
    }

    // 4) Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 5) Sorting
    let sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      const allowedSortFields = ['title', 'date', 'city', 'capacity', 'createdAt', 'registrations'];
      
      sortFields.forEach(field => {
        const cleanField = field.startsWith('-') ? field.slice(1) : field;
        if (allowedSortFields.includes(cleanField)) {
          const order = field.startsWith('-') ? -1 : 1;
          sort[cleanField] = order;
        }
      });
    }

    // 6) Handle sorting by registrations (special case)
    let events;
    let total;

    if (sort.registrations) {
      // Use aggregation to sort by registration count
      const pipeline = [
        { $match: { ...filter, ...searchFilter } },
        {
          $lookup: {
            from: 'registrations',
            localField: '_id',
            foreignField: 'event',
            as: 'registrations'
          }
        },
        {
          $addFields: {
            registrationCount: { $size: '$registrations' }
          }
        },
        { $sort: { registrationCount: sort.registrations } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $lookup: {
            from: 'users',
            localField: 'organizer',
            foreignField: '_id',
            as: 'organizer'
          }
        },
        { $unwind: '$organizer' },
        {
          $project: {
            'organizer.password': 0
          }
        }
      ];

      const result = await Event.aggregate(pipeline);
      
      // Get total count without pagination
      const countPipeline = [
        { $match: { ...filter, ...searchFilter } },
        { $count: 'total' }
      ];
      const countResult = await Event.aggregate(countPipeline);
      
      events = result;
      total = countResult.length > 0 ? countResult[0].total : 0;
    } else {
      // Normal query (without registration sorting)
      let query = Event.find({ ...filter, ...searchFilter })
        .populate('category')
        .populate('organizer', '-password');

      // Apply sorting
      if (Object.keys(sort).length > 0) {
        query = query.sort(sort);
      } else {
        query = query.sort('-createdAt');
      }

      // Apply pagination
      query = query.skip(skip).limit(limit);

      events = await query;
      total = await Event.countDocuments({ ...filter, ...searchFilter });
    }

    res.status(200).json({
      status: 'success',
      results: events.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: events
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    next(error);
  }
});
module.exports = { getEvents, createEvent };