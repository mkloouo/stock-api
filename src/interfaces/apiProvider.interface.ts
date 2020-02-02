import {Router} from 'express';

export interface ApiProvider {
  getRouter(): Router;
}
