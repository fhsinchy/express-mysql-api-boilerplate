const { Router } = require('express');

const routes = Router();

routes.get('/', (req, res) => {
  res.status(200).json({
    error: false,
    message: 'Bonjour, mon ami',
  });
});

require('./routes/auth')(routes);
require('./routes/profile')(routes);

module.exports = routes;
