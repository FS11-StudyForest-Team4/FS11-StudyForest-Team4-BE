import express from 'express';
import { studyRouter } from './studies/index.js';
import { habitsRouter } from './habits/habits.routes.js';
import { emojiRouter } from './emojis/index.js';
import { focusRouter } from './foci/index.js';
import { authRouter } from './auth/index.js';
import { HTTP_STATUS } from '#constants';

export const router = express.Router();

router.get('/', (req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .send({ now: new Date().toISOString(), Message: 'OK' });
});

router.use('/studies', studyRouter);
router.use('/habits', habitsRouter);

// /emojis 경로에 Emoji 라우터 연결
router.use('/emojis', emojiRouter);

// /foci 경로에 Focus 라우터 연결
router.use('/focus', focusRouter);

// /auth 경로(모달) auth router 연결
router.use('/verify', authRouter);