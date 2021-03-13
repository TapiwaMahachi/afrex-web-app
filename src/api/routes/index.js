import express from 'express';
import {userRoutes} from './user.routes.js';
import { authRoutes } from './auth.routes.js';

const router = express.Router();

/**
 * GET api/status
 */
router.get('/status', (req,res)=>res.send('Ok'));


router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;