import { Router } from 'express';
import { getUserProfile, updateUserProfile, getUserById } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/:id', getUserById);

export default router;
