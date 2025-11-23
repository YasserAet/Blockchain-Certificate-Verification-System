import { Router, Request, Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { createCertificate, getCertificateById, getCertificatesByStudentId, generateCertificateHash, updateCertificateStatus } from '../services/certificate.service'
import { queryDatabase } from '../services/database'

export const certificateRoutes = Router()

certificateRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const cert = await getCertificateById(id)
    
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    res.json(cert)
  } catch (err: any) {
    console.error('[Certificates] Get error:', err)
    res.status(500).json({ error: err.message || 'Failed to fetch certificate' })
  }
})

certificateRoutes.get('/student/:studentId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params

    if (req.user?.id !== studentId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const certs = await getCertificatesByStudentId(studentId)
    res.json({ certificates: certs })
  } catch (err: any) {
    console.error('[Certificates] List error:', err)
    res.status(500).json({ error: err.message || 'Failed to fetch certificates' })
  }
})

certificateRoutes.post(
  '/upload',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { image, certificateType, issuerName, certificateTitle, issueDate, expiryDate } = req.body

      if (!image || !certificateType || !issuerName || !certificateTitle || !issueDate) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const studentResult = await queryDatabase(
        `SELECT id FROM students WHERE user_id = $1`,
        [req.user?.id]
      )

      if (studentResult.rows.length === 0) {
        return res.status(400).json({ error: 'Student profile not found' })
      }

      const studentId = studentResult.rows[0].id

      // Get issuer institution ID
      const issuerResult = await queryDatabase(
        `SELECT id FROM institutions WHERE institution_name = $1`,
        [issuerName]
      )

      const issuerId = issuerResult.rows[0]?.id || 'unknown_issuer'

      // Generate certificate hash from image and metadata
      const imageBuffer = Buffer.from(image.split(',')[1] || image, 'base64')
      const certificateHash = await generateCertificateHash(imageBuffer, {
        certificateType,
        certificateTitle,
        issueDate,
      })

      // Create certificate in database
      const certificate = await createCertificate(
        certificateHash,
        studentId,
        issuerId,
        certificateType,
        certificateTitle,
        issueDate,
        expiryDate,
        `data:image/png;base64,${image}`
      )

      res.status(201).json({
        message: 'Certificate uploaded successfully',
        certificate: {
          id: certificate.id,
          hash: certificate.certificateHash,
          status: certificate.status,
        },
      })
    } catch (err: any) {
      console.error('[Certificates] Upload error:', err)
      res.status(500).json({ error: err.message || 'Upload failed' })
    }
  }
)
