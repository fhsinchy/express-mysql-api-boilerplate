const logger = require('morgan');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { bouncer } = require('../middleware/bouncer');

const routes = require('../routes');

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

app.use(bouncer);

module.exports = app;
