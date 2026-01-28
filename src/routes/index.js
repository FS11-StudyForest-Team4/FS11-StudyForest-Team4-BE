import express from 'express';
import { studiesRouter } from './studies/studies.routes.js'
import { habitsRouter } from './habits/habits.routes.js';


export const router = express.Router();

router.use('/studies', studiesRouter)
router.use('/habits', habitsRouter)