import createHttpError from 'http-errors';
export const errorHandler = (err, req, res, next) => {
  console.error('Error Middleware:', err);
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  const isDev = process.env.NODE_ENV === 'development';
  return res.status(500).json({
    message: isDev
      ? err.message
      : 'Something went wrong. Please try again later',
  });
};
