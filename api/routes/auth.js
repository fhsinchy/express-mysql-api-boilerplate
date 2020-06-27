const { Router } = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, Token } = require('../../models');
const ClientError = require('../../classes/ClientError');

const middleware = require('../middleware');

const router = Router();

module.exports = (routes) => {
  routes.use('/auth', router);

  router.post('/register', async (req, res, next) => {
    try {
      if (await User.query().where({ email: req.body.email }).first()) {
        throw new ClientError(400, 'Email Already Taken!');
      } else {
        const user = await User.query().insert({
          name: req.body.name,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 12),
        });

        res.status(201).json({
          status: 'success',
          message: 'User Registered!',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          },
        });
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const user = await User.query().where({ email: req.body.email }).first();

      if (!user) {
        throw new ClientError(400, 'Wrong Email!');
      } else if (await bcrypt.compare(req.body.password, user.password)) {
        const tokenPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '5m',
        });
        let refreshToken = await user.$relatedQuery('token');

        if (!refreshToken) {
          refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

          await user.$relatedQuery('token').insert({
            token: refreshToken,
            user_id: user.id,
          });
        } else {
          refreshToken = refreshToken.token;
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
      } else {
        throw new ClientError(400, 'Wrong Password!');
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/token/refresh', async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new ClientError(401, 'Unauthorized!');
      }

      const token = await Token.query().where({ token: refreshToken }).first();

      if (!token) {
        throw new ClientError(403, 'Forbidden!');
      } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
          if (err) {
            throw new ClientError(403, err.message);
          }
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

          res.status(200).json({
            status: 'success',
            message: 'Token Generated!',
            accessToken,
          });
        });
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/logout', middleware.authenticate, async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new ClientError(401, 'Unauthorized!');
      } else {
        const token = await Token.query().where({ token: refreshToken }).first();

        if (!token) {
          throw new ClientError(403, 'Forbidden!');
        } else {
          await Token.query().where({ token: refreshToken }).del();

          res.clearCookie('refreshToken');

          res.status(200).json({
            status: 'success',
            message: 'Logged Out!',
          });
        }
      }
    } catch (err) {
      next(err);
    }
  });
};
