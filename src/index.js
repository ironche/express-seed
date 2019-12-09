import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { AppConfig } from './config';
import { success, logRequest } from './utils';

express()
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(cookieParser())
  .use(logRequest)
  .use('/', routes())
  .listen(AppConfig.PORT, () => {
    // eslint-disable-next-line
    console.clear();
    success(`Server is up and running on port ${AppConfig.PORT}`);
  });
