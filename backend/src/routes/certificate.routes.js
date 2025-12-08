import { Router } from 'express';
import { 
  uploadCertificate, 
  getAllCertificates, 
  getCertificateById,
  verifyCertificate 
} from '../controllers/certificate.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/upload', authenticate, authorize('institution'), upload.single('certificate'), uploadCertificate);
router.get('/', authenticate, getAllCertificates);
router.get('/:id', authenticate, getCertificateById);
router.post('/:id/verify', verifyCertificate);
router.post('/verify/:id', verifyCertificate);
router.post('/verify-by-hash/:hash', verifyCertificate);

export default router;
