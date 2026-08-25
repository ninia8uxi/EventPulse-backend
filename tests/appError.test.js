const AppError = require('../../utils/AppError');

describe('AppError Class', () => {
  test('should create an operational error with correct status and message', () => {
    const error = new AppError('Something went wrong', 404);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  test('should set status to "error" for 500-level status codes', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });

  test('should capture stack trace', () => {
    const error = new AppError('Test', 400);
    expect(error.stack).toBeDefined();
  });
});