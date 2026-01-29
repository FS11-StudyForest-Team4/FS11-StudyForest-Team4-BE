import express from 'express';
import { emojiRepository } from '#repository';
import { HTTP_STATUS, PRISMA_ERROR, ERROR_MESSAGE } from '#constants';

export const emojiRouter = express.Router();

//GET /api/emojis/:studyId - 스터디의 모든 이모지 조회
emojiRouter.get('/:studyId', async (req, res) => {
  const { studyId } = req.params;
  try {
    const emoji = await emojiRepository.findEmojisByStudyId(studyId);

    res.json(emoji);
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_GET_EMOJIS });
  }
});

//POST /api/emojis/:studyId - 이모지 생성 (첫 생성시 count = 1)
emojiRouter.post('/:studyId', async (req, res) => {
  try {
    const { studyId } = req.params;
    const { name } = req.body;

    const newEmoji = await emojiRepository.createEmoji({
      name,
      studyId: String(studyId),
    });

    res.status(HTTP_STATUS.CREATED).json(newEmoji);
  } catch (error) {
    if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ error: '이미 존재하는 이모지입니다.' });
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_POST_EMOJIS });
  }
});

//PATCH /api/emojis/:studyId/:emojiId - 이모지 count 증가
emojiRouter.patch('/:studyId/:emojiId', async (req, res) => {
  try {
    const { studyId, emojiId } = req.params;
    const { name, count } = req.body;

    const increaseEmojiCount = await emojiRepository.increaseEmojiCount(studyId, emojiId, {
      name,
      count,
    });

    res.json(increaseEmojiCount);
  } catch (error) {
    // Prisma 에러: 레코드를 찾을 수 없음
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.EMOJI_NOT_FOUND });
    }
  }
});

//DELETE /api/emojis/:studyId/:emojiId - 이모지 삭제
emojiRouter.delete('/:studyId/:emojiId', async (req, res) => {
  try {
    const { emojiId } = req.params;
    const emoji = await emojiRepository.findEmojiById(emojiId);

    if (!emoji) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: '이모지를 찾을 수 없습니다.' });
    }

    if (emoji.count !== 0) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ error: ERROR_MESSAGE.FAILED_TO_DELETE_EMOJIS });
    }

    await emojiRepository.deleteEmoji(emojiId);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.FAILED_TO_DELETE_EMOJIS });
    }
  }
});
