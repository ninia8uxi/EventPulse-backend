const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  test('should call the function and pass req, res, next', async () => {
    const mockFn = jest.fn().mockResolvedValue('ok');
    const handler = asyncHandler(mockFn);

    const req = {};
    const res = {};
    const next = jest.fn();

    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('should catch error and pass to next', async () => {
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const handler = asyncHandler(mockFn);

    const req = {};
    const res = {};
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});