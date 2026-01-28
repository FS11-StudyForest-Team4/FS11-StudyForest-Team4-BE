import { habitRepository } from '#repository';
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

      const existingHabit = await habitRepository.findCommentById(id);
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
