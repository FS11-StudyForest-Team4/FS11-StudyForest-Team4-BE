import { habitlogRepository, habitRepository } from '#repository';
import express from 'express';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares';
import { NotFoundException } from '#exceptions';
import { habitIdParamSchema, habitlogQuerySchema } from './habitlogs.schema.js';

export const habitlogsRouter = express.Router();


//습관기록 조회
habitlogsRouter.get(
  'studies/:id/habitlogs', 
   validate('query', habitlogQuerySchema),
  async (req, res, next) => {
  try {
    const { startOfWeek, endOfWeek } = req.query;
    const habitlogs = await habitlogRepository.findHabitlogs(
      startOfWeek,
      endOfWeek,
    );
    res.status(200).json(habitlogs);
  } catch (error) {
    next(error);
  }
});
