const logger = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('../routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

module.exports = app;
