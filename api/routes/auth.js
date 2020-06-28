const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const { authenticate } = require('../middleware');
const { User, Token } = require('../../models');
const { AuthService } = require('../../services');

const router = Router();
const authService = new AuthService(User, Token);

module.exports = (routes) => {
  routes.use('/auth', router);

  router.post(
    '/register',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().trim().required(),
        email: Joi.string().email().trim().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        res.status(201).json({
          status: 'success',
          message: 'User Registered!',
          data: {
            user: await authService.signup(req.body),
          },
        });
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    '/login',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().trim().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        const { accessToken, refreshToken } = await authService.login(req.body);

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
      } catch (err) {
        next(err);
      }
    },
  );

  router.post('/token/refresh', async (req, res, next) => {
    try {
      const accessToken = await authService.refresh(req.cookies);

      res.status(200).json({
        status: 'success',
        message: 'Token Generated!',
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/logout', authenticate, async (req, res, next) => {
    try {
      await authService.logout(req.cookies);

      res.clearCookie('refreshToken');

      res.status(200).json({
        status: 'success',
        message: 'Logged Out!',
      });
    } catch (err) {
      next(err);
    }
  });
};
