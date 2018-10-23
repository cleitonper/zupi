const { accessLogger, errorLogger } = require('../logger');

const logAccess = (request, response, error = {}) => {
  response.on('finish', function() {
    const { ip, method, originalUrl, httpVersion } = request;
    const { statusCode } = response;
    const detail = error.message || 'OK';
    const message = `[${ip}] ${method} ${originalUrl} HTTP/${httpVersion} ${statusCode} ${detail}`;
    accessLogger.log({ level: 'info', message: message });
  });
};

const logError = (error) => {
  errorLogger.log({ level: 'error', message: error });
};

const error = (error, request, response, next) => {
  if (!error) next();
  logError(error);
  logAccess(request, response, error);
  next(error);
};

const access = (request, response, next) => {
  logAccess(request, response);
  next();
};

module.exports = {
  error,
  access
};
