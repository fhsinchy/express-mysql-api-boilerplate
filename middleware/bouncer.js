class Bounce extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

// eslint-disable-next-line no-unused-vars
const bouncer = (err, req, res, next) => {
  if (err instanceof Bounce) {
    const { status, message } = err;
    res.status(status).json({
      status: 'fail',
      message,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(err);

    const message = process.env.NODE_ENV === 'production' ? 'Something Went Wrong!' : err.message;

    res.status(500).json({
      status: 'error',
      message,
    });
  }
};

module.exports = { Bounce, bouncer };
