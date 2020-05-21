const { Router } = require('express');

const authMiddleware = require('../middleware/auth');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    error: false,
    message: 'Bonjour, mon ami',
  });
});

router.get('/profile', authMiddleware, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User Profile.',
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});

module.exports = router;
