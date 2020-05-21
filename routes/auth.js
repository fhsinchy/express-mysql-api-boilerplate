const dotenv = require('dotenv');
const array = require('lodash/array');
const { Router } = require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../db');
const authMiddleware = require('../middleware/auth');

dotenv.config();

const router = Router();

router.post('/register', async (req, res) => {
  if (array.head(await db('users').where({ email: req.body.email }))) {
    res.status(400).json({
      status: 'fail',
      message: 'Email Already Taken!',
    });
  } else {
    try {
      const userId = await db('users').insert({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      res.status(201).json({
        status: 'success',
        message: 'User Registered!',
        data: {
          user: {
            id: array.head(userId),
          },
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message,
      });
    }
  }
});

router.post('/login', async (req, res) => {
  const user = array.first(await db('users').where({ email: req.body.email }));

  if (!user) {
    res.status(400).json({
      status: 'fail',
      message: 'Wrong Email or Password!',
    });
  } else if (await bcrypt.compare(req.body.password, user.password)) {
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '5m' });
    let refreshToken = array.first(await db('tokens').where({ user_id: user.id }));

    if (!refreshToken) {
      refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

      try {
        await db('tokens').insert({
          token: refreshToken,
          user_id: user.id,
        });
      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'User Logged In!',
      accessToken,
    });
  }
});

router.post('/token/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!',
    });
  }

  const token = array.first(await db('tokens').where({ token: refreshToken }));

  if (!token) {
    res.status(403).json({
      status: 'fail',
      message: 'Forbidden!',
    });
  } else {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        res.status(403).json({
          status: 'fail',
          message: err.message,
        });
      }
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

      res.status(200).json({
        status: 'success',
        message: 'Token Generated!',
        accessToken,
      });
    });
  }
});

router.post('/logout', authMiddleware, async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!',
    });
  } else {
    try {
      const token = array.first(await db('tokens').where({ token: refreshToken }));

      if (!token) {
        res.status(403).json({
          status: 'fail',
          message: 'Forbidden!',
        });
      } else {
        await db('tokens').where({ token: refreshToken }).del();

        res.clearCookie('refreshToken');

        res.status(200).json({
          status: 'success',
          message: 'Logged Out!',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message,
      });
    }
  }
});

module.exports = router;
