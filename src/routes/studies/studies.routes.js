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
  // authSchema,
} from './studies.schema.js';
import { NotFoundException } from '#exceptions';
import { success } from 'zod';
// import { generateTokens, setAuthCookies, verifyToken } from '#utils';

export const studiesRouter = express.Router();

//라우터 우선순위로 인해 위로 배치
// GET //studies/{studyId}/auth - 쿠키확인
studiesRouter.get('/:id/auth', async (req, res) => {
  // const token = req.cookies.accessToken;
  // const payload = verifyToken(token, 'access');
  // if (!payload) {
    //   return res
    //     .status(HTTP_STATUS.UNAUTHORIZED)
    //     .json({ error: ERROR_MESSAGE.INVALID_CREDENTIALS });
    // }
    //비밀번호를 제외한 데이터 response
    // const study = await studyRepository.findById(payload.studyId);
    // res.json(study);
    console.log('인증 확인 요청 들어옴:', req.params.id);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({success: true, message: '지나가유~'})
});

// POST /studies/{studyId}/auth - 비밀번호 체크
studiesRouter.post(
  '/:id/auth',
  validate('params', idParamSchema),
  validate('body', authSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const study = await studyRepository.verifyPassword(id, password);
      if (!study) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: ERROR_MESSAGE.INVALID_CREDENTIALS,
        });
      }

      const tokens = generateTokens(study);
      setAuthCookies(res, tokens);

      //비밀번호를 제외한 데이터 response
      const { password: _, ...studyWithoutPassword } = study;
      res.status(HTTP_STATUS.OK).json(studyWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

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
      const result = await habitRepository.getTodayHabits(studyId);
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

      const deletedStudy = await studyRepository.remove(id);

      //204 send로 바꾸었었는데 메세지 포함하여 200으로 다시 바꿈
      res.status(HTTP_STATUS.OK).json({
        message: `${deletedStudy.nickName}의 ${deletedStudy.title}스터디가 삭제되었습니다.`,
      });
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

      // const tokens = generateTokens(newStudy);
      // setAuthCookies(res, tokens);

      const { password: _, ...studyWithoutPassword } = newStudy;

      res.status(HTTP_STATUS.CREATED).json(studyWithoutPassword);
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
      const { q: keyword, cursor, limit, orderBy } = req.query;

      const studies = await studyRepository.findAll(
        { keyword, cursor, limit, orderBy },
        {
          emojis: {
            orderBy: {
              count: 'desc',
            },
          },
        },
      );

      res.status(HTTP_STATUS.OK).json(studies);
    } catch (error) {
      next(error);
    }
  },
);
