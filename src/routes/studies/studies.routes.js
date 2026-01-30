import express from 'express';
import { studyRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { /*authMiddleware,*/ validate } from '#middlewares';
import {
  createStudySchema,
  findStudySchema,
  idParamSchema,
  updateStudySchema,
} from './studies.schema.js';
import { NotFoundException } from '#exceptions';

export const studiesRouter = express.Router();

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

      const nextCursor =
        studies.length === limit ? studies[studies.length - 1].id : null;

      res.status(HTTP_STATUS.OK).json({ data: studies, nextCursor });
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

      const deletedStudy = await studyRepository.remove(id);

      res
        .status(HTTP_STATUS.NO_CONTENT)
        .json({ message: '스터디가 삭제되었습니다.', ...deletedStudy });
    } catch (error) {
      next(error);
    }
  },
);
