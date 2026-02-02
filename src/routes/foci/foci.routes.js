import express from 'express';
import { focusRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { NotFoundException } from '#exceptions';

export const fociRouter = express.Router();

// GET /focus/:studyId
fociRouter.get('/:studyId', async (req, res, next) => {
  try {
    const { studyId } = req.params;

    const result = await focusRepository.getTotalPoint(studyId);

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGE.FAILED_TO_FETCH_FOCUS);
    }

    res.status(HTTP_STATUS.OK).json({
      studyId,
      totalPoint: result.totalPoint,
    });
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

// POST /focus
fociRouter.post('/', async (req, res, next) => {
  try {
    const { studyId } = req.body;

    if (!studyId) {
      throw new NotFoundException(ERROR_MESSAGE.FAILED_TO_CREATE_FOCUS);
    }

    const result = await focusRepository.create(studyId);
    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    console.error('error: ', error);
    next(error);
  }
});

// PATCH /focus/:focusId
fociRouter.patch('/:focusId', async (req, res, next) => {
  try {
    const { focusId } = req.params;

    if (!focusId) {
      throw new NotFoundException(ERROR_MESSAGE.FAILED_TO_COMPLETE_FOCUS);
    }

    const result = await focusRepository.complete(focusId);

    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error('errror: ', error);
    next(error);
  }
});
