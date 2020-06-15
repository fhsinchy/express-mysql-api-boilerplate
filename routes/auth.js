const { Router } = require('express');
const { register, login, refresh, logout } = require('../controllers/auth');
const { authenticate } = require('../middleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/token/refresh', refresh);
router.post('/logout', authenticate, logout);

module.exports = router;
