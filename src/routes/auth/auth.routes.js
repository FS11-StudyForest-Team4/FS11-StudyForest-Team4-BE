//⚠️studies.route에 합쳐질 내용들입니다.

import express from 'express';
import { studyRepository } from '#repository';
import { generateTokens, setAuthCookies, comparePassword } from '#utils';
import { validate } from '#middlewares';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { authSchema } from './auth.schema.js';
import { UnauthorizedException } from '#exceptions';

export const authRouter = express.Router();

// /auth/{studyId}/verify -> studies.route로 들어갈 예정입니다.
authRouter.post(
  '/:id/verify',
  validate('body', authSchema),
  validate('params', authSchema),
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
