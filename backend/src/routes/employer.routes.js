import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getVerificationHistory } from '../controllers/certificate.controller.js';

const router = express.Router();

// Get verification history for logged-in employer
router.get('/verification-history', authenticate, authorize('employer'), getVerificationHistory);

export default router;
