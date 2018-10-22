const unauthorized = (error, request, response, next) => {
  if (error.name === 'UnauthorizedError') {
    return response.boom.unauthorized(error.message);
  }
  return next();
};

module.exports = {
  unauthorized
};
