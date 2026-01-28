import { habitRepository } from '#repository';
import express from 'express';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares';
import { NotFoundException } from '#exceptions';
import { createHabitSchema, studyIdParamSchema } from './studies.schema.js';
import { studyRepository } from '../../repository/study.repository.js';

export const studiesRouter = express.Router();

//POST /studies/:studyId/habits - 습관 등록
studiesRouter.post(
  '/:studyId/habits',
  validate('body', createHabitSchema),
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const { studyId } = req.params
      const study = await studyRepository.findStudyById(studyId)
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }
      const newHabit = await habitRepository.creatHabit(studyId,{
        name,
      });
      res.status(HTTP_STATUS.CREATED).json(newHabit);
    } catch (error) {
      next(error);
    }
  },
);

//GET /studies/:studyId/habits - 습관 목록 조회
studiesRouter.get(
  '/:studyId/habits',
  validate('params', studyIdParamSchema),
  async (req, res, next) => {
    try {
      const { studyId } = req.params;
      const study = await studyRepository.findStudyById(studyId)
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }
      const result = await habitRepository.findHabitsForStudy(studyId)
      res.status(HTTP_STATUS.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
)
