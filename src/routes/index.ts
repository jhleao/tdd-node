import { Router } from 'express';

import auth from '@routes/auth';
import profile from '@routes/profile';

const router = Router();

router.use('/auth', auth);
router.use('/profile', profile);

export default router;
