import { habitlogRepository, habitRepository } from '#repository';
import express from 'express';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares';
import { NotFoundException } from '#exceptions';
import { idParamSchema, updateHabitSchema } from './habits.schema.js';


export const habitsRouter = express.Router()





// PATCH / habits/:id - 습관 수정
habitsRouter.patch(
  '/:id',
  validate('params', idParamSchema),
  validate('body', updateHabitSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const existingHabit = await habitRepository.findHabitById(id);
      if (!existingHabit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      const updatedHabit= await habitRepository.updateHabit(id, {
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
  '/:id',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const existingHabit = await habitRepository.findHabitById(id);
      if (!existingHabit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }

      await habitRepository.deleteHabit(id);
      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  },
);


//습관기록 등록 or 습관완료
habitsRouter.post(
  '/:id/habitlogs',
  validate('params', idParamSchema),
  async (req, res, next) => {
    try {
      const { id: habitId } = req.params;
      const habit = await habitRepository.findHabitById(habitId);
      if (!habit) {
        throw new NotFoundException(ERROR_MESSAGE.HABIT_NOT_FOUND);
      }
      const newHabitlog = await habitlogRepository.createHabitlog(habitId);
      res.status(HTTP_STATUS.CREATED).json(newHabitlog);
    } catch (error) {
      next(error);
    }
  },
);
