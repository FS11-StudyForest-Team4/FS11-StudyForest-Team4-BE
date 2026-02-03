import express from 'express';
import {
  habitlogRepository,
  habitRepository,
  studyRepository,
} from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { /*authMiddleware,*/ validate } from '#middlewares';
import {
  createHabitSchema,
  habitlogQuerySchema,
  createStudySchema,
  findStudySchema,
  idParamSchema,
  updateStudySchema,
} from './studies.schema.js';
import { NotFoundException } from '#exceptions';

export const studiesRouter = express.Router();

//라우터 우선순위로 인해 위로 배치
// GET /studies/{studyId}/habitlogs - 습관기록표 조회
studiesRouter.get(
  '/:id/habitlogs',
  validate('params', idParamSchema),
  validate('query', habitlogQuerySchema),
  async (req, res, next) => {
    try {
      const { id: studyId } = req.params;
      const { startOfWeek } = req.query;

      const study = await studyRepository.findById(studyId);
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }
      const habitlogs = await habitlogRepository.findHabitlogs(
        studyId,
        startOfWeek,
      );
      res.status(HTTP_STATUS.OK).json(habitlogs);
    } catch (error) {
      next(error);
    }
  },
);


//POST /studies/{studyId}/habits - 습관 등록
studiesRouter.post(
  '/:id/habits',
  validate('body', createHabitSchema),
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const { id: studyId } = req.params;
      const study = await studyRepository.findById(studyId);
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }
      const newHabit = await habitRepository.create(studyId, {
        name,
      });
      res.status(HTTP_STATUS.CREATED).json(newHabit);
    } catch (error) {
      next(error);
    }
  },
);

//GET /studies/{studyId}/habits - 습관 목록 조회
studiesRouter.get(
  '/:id/habits',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id: studyId } = req.params;
      const study = await studyRepository.findById(studyId);
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }
      const result = await habitRepository.findHabitsForStudy(studyId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
);

//특정 스터디 조회: GET /api/studies/{studyId}
studiesRouter.get(
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const study = await studyRepository.findById(id, {
        emojis: {
          orderBy: {
            count: 'desc',
          },
        },
      });
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json(study);
    } catch (error) {
      next(error);
    }
  },
);

//특정 스터디 수정: PATCH /api/studies/{studyId}
studiesRouter.patch(
  '/:id',
  // authMiddleware,
  validate('params', idParamSchema),
  validate('body', updateStudySchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password, title, description, nickName, background } = req.body;

      const study = await studyRepository.findById(id);
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }

      const updatedStudy = await studyRepository.edit(id, {
        password,
        title,
        description,
        nickName,
        background,
      });

      res.status(HTTP_STATUS.OK).json(updatedStudy);
    } catch (error) {
      next(error);
    }
  },
);

//특정 스터디 삭제: DELETE /api/studies/{studyId}
studiesRouter.delete(
  '/:id',
  // authMiddleware,
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const study = await studyRepository.findById(id);
      if (!study) {
        throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
      }
      await studyRepository.remove(id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
);

//스터디 생성:POST /api/studies
studiesRouter.post(
  '/',
  validate('body', createStudySchema),
  async (req, res, next) => {
    try {
      const { password, title, description, nickName, background } = req.body;
      const newStudy = await studyRepository.create({
        password,
        title,
        description,
        nickName,
        background,
      });
      res.status(HTTP_STATUS.CREATED).json(newStudy);
    } catch (error) {
      next(error);
    }
  },
);

//스터디 목록 조회: GET /api/studies
studiesRouter.get(
  '/',
  validate('query', findStudySchema),
  async (req, res, next) => {
    try {
      const { q, cursor, limit, orderBy } = req.query;

      const studies = await studyRepository.findAll(
        { q, cursor, limit, orderBy },
        {
          emojis: {
            orderBy: {
              count: 'desc',
            },
          },
        },
      );

      const limitNum = Number(req.query.limit) || 6; //limit을 숫자로 지정
      const lastStudy = studies[studies.length - 1]; //cursor 지정할 스터디 결정

      const nextCursor = studies.length >= limitNum ? lastStudy.id : null; //다음 cursor 반환
      res.status(HTTP_STATUS.OK).json({ data: studies, nextCursor });
    } catch (error) {
      next(error);
    }
  },
);

