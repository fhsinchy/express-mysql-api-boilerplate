const jwt = require('jsonwebtoken');
const { ErrorService } = require('../../services');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new ErrorService.ClientError(401, 'Unauthorized!');
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) throw new ErrorService.ClientError(403, err.message);
    req.user = user;
  });

  return next();
};
