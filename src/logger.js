const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const ROOT_PATH = require('app-root-path');
const BREAK_LINE = '\n';
const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

createLogger({
  exitOnError: false,
  format: combine(
    timestamp({ format: DATE_FORMAT }),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}${BREAK_LINE}`)
  ),
  exceptionHandlers: [
    new transports.File({ filename: `${ROOT_PATH}/log/exceptions.log` })
  ]
});

const errorLogger = createLogger({
  format: combine(
    timestamp({ format: DATE_FORMAT }),
    printf((info) => `${info.timestamp} Error: ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: `${ROOT_PATH}/log/error.log`, level: 'error' })
  ]
});

const accessLogger = createLogger({
  format: combine(
    timestamp({ format: DATE_FORMAT }),
    printf((info) => `${info.timestamp} ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: `${ROOT_PATH}/log/access.log`, level: 'info' })
  ]
});

const debugLogger = createLogger({
  format: combine(
    colorize(),
    printf((info) => `[${info.level}]: ${info.message}`)
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = {
  accessLogger,
  errorLogger,
  debugLogger
};
