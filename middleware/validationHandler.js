const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value || null
    }));

    return res.status(422).json({
      status: 'fail',
      errors: formattedErrors
    });
  }
  
  next();
};

module.exports = validate;