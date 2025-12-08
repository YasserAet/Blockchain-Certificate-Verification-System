import { Router } from 'express';
import { getStats, getAllUsers } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate, authorize('admin'), getStats);
router.get('/users', authenticate, authorize('admin'), getAllUsers);

export default router;
