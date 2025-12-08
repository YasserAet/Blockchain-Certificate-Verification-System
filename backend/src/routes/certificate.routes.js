import { Router } from 'express';
import { 
  uploadCertificate, 
  getAllCertificates, 
  getCertificateById,
  verifyCertificate,
  downloadCertificate
} from '../controllers/certificate.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/upload', authenticate, authorize('institution'), upload.single('certificate'), uploadCertificate);
router.get('/', authenticate, getAllCertificates);
router.get('/:id', authenticate, getCertificateById);
router.get('/:id/download', authenticate, downloadCertificate);

// Public verification (no authentication required)
router.post('/:id/verify', verifyCertificate);
router.post('/verify/:id', verifyCertificate);
router.post('/verify-by-hash/:hash', verifyCertificate);

// Employer verification (with authentication to save history)
router.post('/employer/:id/verify', authenticate, authorize('employer'), verifyCertificate);
router.post('/employer/verify-by-hash/:hash', authenticate, authorize('employer'), verifyCertificate);

export default router;
