import { habitlogRepository, habitRepository } from '#repository';
import express from 'express';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares';
import { NotFoundException } from '#exceptions';
import { habitIdParamSchema, updateHabitSchema } from './habits.schema.js';
import { todayTimeRange } from '#utils';

export const habitsRouter = express.Router();

// PATCH / habits/:id - 습관 수정
habitsRouter.patch(
  '/:habitId',
  validate('params', habitIdParamSchema),
  validate('body', updateHabitSchema),
  async (req, res, next) => {
    try {
      const { habitId } = req.params;
      const { name } = req.body;

      const existingHabit = await habitRepository.findById(habitId);
      if (!existingHabit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      const updatedHabit = await habitRepository.update(habitId, {
        name,
      });
      res.status(HTTP_STATUS.OK).json(updatedHabit);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /habits/:id - 습관 삭제
habitsRouter.delete(
  '/:habitId',
  validate('params', habitIdParamSchema),
  async (req, res, next) => {
    try {
      const { habitId } = req.params;
      const existingHabit = await habitRepository.findById(habitId);
      if (!existingHabit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      await habitRepository.remove(habitId);
      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);

//습관기록 등록 or 습관완료
habitsRouter.post(
  '/:habitId/habitlog',
  validate('params', habitIdParamSchema),
  async (req, res, next) => {
    try {
      const { habitId } = req.params;
      const habit = await habitRepository.findById(habitId);
      if (!habit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      const { startOfToday, endOfToday } = todayTimeRange;
      const habitLog = await habitlogRepository.findFirst({
        habitId,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      });
      const shouldRemove = !!habitLog;

      shouldRemove
        ? await habitlogRepository.remove(habitLog.id)
        : await habitlogRepository.create(habitId);

      const isCompleted = shouldRemove ? false : true;

      res.status(HTTP_STATUS.CREATED).json(isCompleted);
    } catch (error) {
      next(error);
    }
  },
);
