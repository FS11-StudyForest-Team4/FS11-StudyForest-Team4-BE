import express from 'express';
import { emojisRouter } from './emojis.routes.js';

export const emojiRouter = express.Router();

// /emojis 경로에 Emoji CRUD 라우트 연결
emojiRouter.use('/', emojisRouter);
