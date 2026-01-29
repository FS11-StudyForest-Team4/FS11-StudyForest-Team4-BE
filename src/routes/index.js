import express from 'express';
import { emojiRouter } from './emojis/index.js';

export const router = express.Router();

// /emojis 경로에 Emoji 라우터 연결
router.use('/emojis', emojiRouter);
