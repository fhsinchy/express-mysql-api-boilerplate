/**
 * Module dependencies.
 */

const knex = require('knex');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const express = require('express');
const { Model } = require('objection');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const knexfile = require('./knexfile');
const { bouncer } = require('./middleware');

/**
 * dotenv initialization.
 */

dotenv.config();

/**
 * ORM initialization.
 */

Model.knex(knex(knexfile[process.env.NODE_ENV]));

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
 * Error handler registration.
 */

app.use(bouncer);

module.exports = app;
