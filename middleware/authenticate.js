const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!',
    });
  } else {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        res.status(403).json({
          status: 'fail',
          message: err.message,
        });
      }
      req.user = user;
      next();
    });
  }
};
