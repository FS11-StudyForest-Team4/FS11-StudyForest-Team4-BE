import express from 'express';
import { focusRepository } from '../repository/focus.repository.js';

const focusRouter = express.Router();

// GET /focus/:studyId
focusRouter.get('/focus/:studyId', async (req, res, next) => {
  try {
    const { studyId } = req.params;

    const result = await focusRepository.getTotalPoint(studyId);

    if (!result) {
      return res
        .status(404)
        .json({ message: '요청하신 studyId에 해당하는 study가 없습니다.' });
    }

    res.json({
      studyId,
      totalPoint: result.totalPoint ?? 0,
    });
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

// POST /focus
focusRouter.post('/focus', async (req, res, next) => {
  try {
    const { studyId } = req.body;

    if (!studyId) {
      return res.status(400).json({ message: 'studyId가 없습니다!' });
    }

    const result = await focusRepository.createFocus(studyId);
    res.status(201).json(result);
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

// PATCH /focus/:focusId
focusRouter.patch('/focus/:focusId', async (req, res, next) => {
  try {
    const { focusId } = req.params;

    const result = await focusRepository.completeFocus(focusId);

    res.status(200).json(result);
  } catch (error) {
    console.error('errro: ', error);
    next(error);
  }
});

export default focusRouter;
