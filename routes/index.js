const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    error: false,
    message: 'Bonjour, mon ami',
  });
});

module.exports = router;
