const dateFormat = require('dateformat');

function consoleLogger(str) {
  console.log(dateFormat(new Date(), 'isoDateTime'), str); // eslint-disable-line no-console
}

const requestLogger = (req, res, next) => {
  const { method, url } = req;
  console.log(dateFormat(new Date(), 'isoDateTime'), method, url); // eslint-disable-line no-console
  next(); // Passing the request to the next handler in the stack.
};

module.exports = {
  consoleLogger,
  requestLogger,
};
