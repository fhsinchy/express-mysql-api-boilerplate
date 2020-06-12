const between = require('../helpers/between');

class Bounce extends Error {
  constructor(status = 500, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

// eslint-disable-next-line no-unused-vars
const bouncer = (err, req, res, next) => {
  const { status, message } = err;
  res.status(status).json({
    status: between(status, 400, 500) ? 'fail' : 'error',
    message,
  });
};

module.exports = { Bounce, bouncer };
