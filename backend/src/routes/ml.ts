import { Router, Request, Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { getCertificateById, updateCertificateStatus } from '../services/certificate.service'
import { processCertificateWithML, storeCertificateMLResults, isMLServiceHealthy } from '../services/ml.service'

export const mlRoutes = Router()

mlRoutes.get('/health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await isMLServiceHealthy()
    res.json({ status: isHealthy ? 'healthy' : 'unhealthy' })
  } catch (err) {
    res.status(500).json({ status: 'error' })
  }
})

mlRoutes.post('/process-certificate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { certificateId, image } = req.body

    if (!certificateId || !image) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify certificate exists
    const certificate = await getCertificateById(certificateId)
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    await updateCertificateStatus(certificateId, 'processing')

    // Process with ML service
    const mlResults = await processCertificateWithML(certificateId, image)

    // Store ML results in database
    await storeCertificateMLResults(certificateId, mlResults)

    // Update certificate status based on fraud detection
    const newStatus = mlResults.fraudDetection.isFraud ? 'flagged' : 'verified'
    await updateCertificateStatus(certificateId, newStatus)

    res.json({
      certificateId,
      status: newStatus,
      results: {
        ocrConfidence: mlResults.ocr.confidence,
        classificationConfidence: mlResults.classification.confidence,
        fraudDetected: mlResults.fraudDetection.isFraud,
        fraudConfidence: mlResults.fraudDetection.confidence,
        extractedData: mlResults.extractedData,
      },
    })
  } catch (err: any) {
    console.error('[ML Route] Processing error:', err)
    
    // Update certificate to error state if available
    const { certificateId } = req.body
    if (certificateId) {
      try {
        await updateCertificateStatus(certificateId, 'error')
      } catch (e) {
        console.error('[ML Route] Failed to update status:', e)
      }
    }

    res.status(500).json({ error: err.message || 'Processing failed' })
  }
})
