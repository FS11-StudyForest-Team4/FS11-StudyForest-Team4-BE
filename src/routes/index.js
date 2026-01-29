import express from 'express';
import { focusRouter } from './focus.routes.js';

export const router = express.Router();

// focus 경로에 Focus 라우터 연결
router.use('/focus', focusRouter);
