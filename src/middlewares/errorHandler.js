const errorHandler = (err, req, res, next) => {
  //Error-handling middleware err parameter is the key
  console.error('Error:', err.stack); //Log the error

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
