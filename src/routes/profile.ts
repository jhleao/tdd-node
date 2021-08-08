import { getProfile } from '@src/controllers/profile';
import authOnly from '@src/middlewares/authOnly';
import { Router } from 'express';

const router = Router();

router.get('/', authOnly, getProfile);

export default router;
