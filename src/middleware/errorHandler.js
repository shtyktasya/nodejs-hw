
export const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message,
    ...(isDev && { stack: err.stack }),
  });
};
