const knex = require('knex');
const logger = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const express = require('express');
const { Model } = require('objection');
const cookieParser = require('cookie-parser');

const { bouncer } = require('../middleware/bouncer');

const knexfile = require('../knexfile');

dotenv.config();

Model.knex(knex(knexfile[process.env.NODE_ENV]));

const routes = require('../routes');

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

app.use(bouncer);

module.exports = app;
