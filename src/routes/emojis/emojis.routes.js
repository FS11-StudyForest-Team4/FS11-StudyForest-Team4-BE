import express from 'express';
import { emojiRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

export const emojisRouter = express.Router();

//GET /api/emojis/:studyId - 스터디의 모든 이모지 조회
emojisRouter.get('/:studyId', async (req, res, next) => {
  const { studyId } = req.params;
  try {
    const emoji = await emojiRepository.findEmojisByStudyId(studyId);

    res.json(emoji);
  } catch (error) {
    next(error);
  }
});

//POST /api/emojis/:studyId - 이모지 count +1
emojisRouter.post('/:studyId', async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { name } = req.body;

    const newEmoji = await emojiRepository.emojiCount({
      name,
      studyId: String(studyId),
    });

    res.status(HTTP_STATUS.CREATED).json(newEmoji);
  } catch (error) {
    next(error);
  }
});

//DELETE /api/emojis/:studyId/:emojiId - 이모지 삭제
emojisRouter.delete('/:studyId/:emojiId', async (req, res, next) => {
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
    next(error);
  }
});
