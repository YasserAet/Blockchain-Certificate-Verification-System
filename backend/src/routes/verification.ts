import { Router, Request, Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { getCertificateByHash, getCertificateById } from '../services/certificate.service'
import { verifyCertificateOnBlockchain, getCertificateDataFromBlockchain } from '../services/blockchain.service'
import { queryDatabase } from '../services/database'

export const verificationRoutes = Router()

verificationRoutes.get('/blockchain/:txHash', async (req: Request, res: Response) => {
  try {
    const { txHash } = req.params

    const result = await queryDatabase(
      `SELECT id, certificate_id FROM blockchain_transactions WHERE tx_hash = $1`,
      [txHash]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    const { certificate_id } = result.rows[0]
    const certificate = await getCertificateById(certificate_id)

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    const isVerified = await verifyCertificateOnBlockchain(certificate.certificateHash)
    const blockchainData = await getCertificateDataFromBlockchain(certificate.certificateHash)

    res.json({
      txHash,
      certificateHash: certificate.certificateHash,
      isValid: isVerified,
      blockchainData,
      certificateDetails: {
        type: certificate.certificateType,
        title: certificate.certificateTitle,
        issueDate: certificate.issueDate,
      },
    })
  } catch (err: any) {
    console.error('[Verification] Blockchain lookup failed:', err)
    res.status(500).json({ error: err.message || 'Verification failed' })
  }
})

verificationRoutes.post('/verify', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { certificateHash } = req.body

    if (!certificateHash) {
      return res.status(400).json({ error: 'Certificate hash required' })
    }

    // Get certificate from database
    const certificate = await getCertificateByHash(certificateHash)
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    // Verify on blockchain
    const isBlockchainValid = await verifyCertificateOnBlockchain(certificateHash)
    const blockchainData = await getCertificateDataFromBlockchain(certificateHash)

    // Get fraud detection results
    const fraudResult = await queryDatabase(
      `SELECT is_fraud_detected, fraud_confidence FROM fraud_detection_results WHERE certificate_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [certificate.id]
    )

    // Get validation scores
    const validationResult = await queryDatabase(
      `SELECT confidence_score FROM validation_scores WHERE certificate_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [certificate.id]
    )

    // Log verification
    await queryDatabase(
      `INSERT INTO verifications (certificate_id, verifier_id, blockchain_confirmed, verification_status)
       VALUES ($1, $2, $3, $4)`,
      [certificate.id, req.user?.id, isBlockchainValid, isBlockchainValid ? 'valid' : 'invalid']
    )

    res.json({
      certificateId: certificate.id,
      certificateHash,
      isValid: isBlockchainValid,
      blockchainConfirmed: !!blockchainData,
      fraudDetected: fraudResult.rows[0]?.is_fraud_detected || false,
      fraudConfidence: fraudResult.rows[0]?.fraud_confidence || 0,
      aiConfidence: validationResult.rows[0]?.confidence_score || 0,
      certificateDetails: {
        type: certificate.certificateType,
        title: certificate.certificateTitle,
        issueDate: certificate.issueDate,
        status: certificate.status,
      },
    })
  } catch (err: any) {
    console.error('[Verification] Verify error:', err)
    res.status(500).json({ error: err.message || 'Verification failed' })
  }
})
