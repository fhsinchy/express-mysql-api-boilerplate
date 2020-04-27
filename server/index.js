import express from 'express';
import logger from 'morgan';

import routes from '../routes';

const server = express();

server.use(logger('dev'));

server.use('/', routes);

export default server;
