/**
 * Module dependencies.
 */

const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const express = require('express');
const { Model } = require('objection');
const cookieParser = require('cookie-parser');

const knex = require('./db/knex');
const routes = require('./api');
const ClientError = require('./classes/ClientError');

/**
 * ORM initialization.
 */

Model.knex(knex);

/**
 * app instance initialization.
 */

const app = express();

/**
 * Middleware registration.
 */

app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

/**
 * Route registration.
 */

app.use('/', routes);

/**
 * 404 handler.
 */

app.use((req, res, next) => {
  next(new ClientError(404, 'Not Found!'));
});

/**
 * Error handler registration.
 */

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    const { status, message } = err;
    res.status(status).json({
      status: 'fail',
      message,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(err);

    const message = process.env.NODE_ENV === 'production' ? 'Something Went Wrong!' : err.message;

    res.status(500).json({
      status: 'error',
      message,
    });
  }
});

module.exports = app;
