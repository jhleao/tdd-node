import { login, register, refresh, logout } from '@src/controllers/auth';
import authOnly from '@src/middlewares/authOnly';
import { Router } from 'express';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/refresh', refresh);
router.post('/logout', authOnly, logout);

export default router;
