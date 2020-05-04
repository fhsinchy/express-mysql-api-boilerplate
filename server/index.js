import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

import routes from '../routes';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

export default app;
