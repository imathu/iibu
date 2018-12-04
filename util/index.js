// const dateFormat = require('dateformat');
const { createLogger, format, transports } = require('winston');

const {
  combine,
  timestamp,
  printf,
} = format;

const myFormat = printf(info => (
  `${info.timestamp} ${info.level}: ${info.message}`
));

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
    new transports.Console(),
  ],
});

function log(message, level = 'info') {
  logger.log({ level, message });
}

const requestLogger = (req, res, next) => {
  const { method, url } = req;
  logger.log({
    level: 'info',
    message: `${method}, ${url}`,
  });
  next(); // Passing the request to the next handler in the stack.
};

module.exports = {
  log,
  requestLogger,
};
