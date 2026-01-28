import express from 'express';
import { studiesRouter } from './studies/index.js'
import { habitsRouter } from './habits/habits.routes.js';


export const router = express.Router();

router.use('/studies', studiesRouter)
router.use('/habits', habitsRouter)