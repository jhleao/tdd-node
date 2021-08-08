import express from 'express';
import routes from '@src/routes';
import 'reflect-metadata';
import dotenv from 'dotenv';
import validateJson from '@middlewares/validateJson';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class AppController {
  public express = express();

  constructor() {
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(validateJson);
    this.express.use(cookieParser());
    this.express.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  }

  routes() {
    this.express.use(routes);
  }
}

export default new AppController().express;
