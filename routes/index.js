const { Router } = require('express');

const authRoutes = require('./auth');
const { authenticate } = require('../middleware');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    error: false,
    message: 'Bonjour, mon ami',
  });
});

router.get('/profile', authenticate, async (req, res) => {
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

router.use('/auth', authRoutes);

module.exports = router;
