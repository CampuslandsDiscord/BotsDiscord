// router/index.ts

import express from 'express';
import userRouter from '../user';
import warningRouter from '../warning'; 
import bannedRouter from '../banned';
import cycleRouter from '../cycle';


const router = express.Router();

router.use('/user', userRouter);
router.use('/warning', warningRouter);
router.use('/banned', bannedRouter);
router.use('/cycle', cycleRouter);

export default router;
