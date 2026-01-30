import express from 'express';
import { studyRouter } from './studies/index.js';
import { emojiRouter } from './emojis/index.js';
import { HTTP_STATUS } from '#constants';

export const router = express.Router();

router.get('/', (req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .send({ now: new Date().toISOString(), Message: 'OK' });
});

router.use('/studies', studyRouter);

// /emojis 경로에 Emoji 라우터 연결
router.use('/emojis', emojiRouter);
