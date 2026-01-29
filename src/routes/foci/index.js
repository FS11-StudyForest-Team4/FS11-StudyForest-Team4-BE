import express from 'express';
import { fociRouter } from './foci.routes.js';

export const focusRouter = express.Router();

focusRouter.use('/', fociRouter);
