//⚠️studies.route에 합쳐질 내용들입니다.

import express from 'express';
import { studyRepository } from '#repository';
import {
  generateTokens,
  setAuthCookies,
  hashPassword,
  comparePassword,
} from '#utils';
import { validate } from '#middlewares';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { signUpSchema, loginSchema } from './auth.schema.js';
import { UnauthorizedException } from '#exceptions';
import { idParamSchema } from './auth.schema.js';

export const authRouter = express.Router();

// 유저 엔티티가 없어 스터디 생성 페이지가 회원가입과, 비밀번호확인이 로그인과 유사한 기능을 하는 것 같습니다.
// -> 강사님 코드 수정한 내용입니다. 이를 바탕으로 studies.route의 /create 수정 후 삭제할 예정입니다.
authRouter.post(
  '/create',
  validate('body', signUpSchema),
  async (req, res, next) => {
    try {
      const { title, password, nickName } = req.body;

      const hashedPassword = await hashPassword(password);

      const study = await studyRepository.create({
        title,
        password: hashedPassword,
        nickName,
      });

      const tokens = generateTokens(study);
      setAuthCookies(res, tokens);

      const { password: _, ...studyWithoutPassword } = study;
      res.status(HTTP_STATUS.CREATED).json(studyWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);

// /auth/{studyId}/verify -> studies.route로 들어갈 예정입니다.
authRouter.post(
  '/:id/verify',
  validate('body', loginSchema),
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id: studyId } = req.params;
      const { password } = req.body;

      const study = await studyRepository.findById(studyId);

      if (!study) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: ERROR_MESSAGE.INVALID_CREDENTIALS,
        });
      }

      const isPasswordValid = await comparePassword(password, study.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIALS);
      }

      const tokens = generateTokens(study);
      setAuthCookies(res, tokens);

      //비밀번호 제외
      const { password: _, ...studyWithoutPassword } = study;
      res.status(HTTP_STATUS.OK).json(studyWithoutPassword);
    } catch (error) {
      next(error);
    }
  },
);
