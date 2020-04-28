import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

import routes from '../routes';

const server = express();

server.use(logger('dev'));
server.use(express.json());
server.use(cookieParser());

server.use('/', routes);

export default server;
