import { queryDatabase } from './database'
import crypto from 'crypto'

export interface Certificate {
  id: string
  certificateHash: string
  studentId: string
  issuerId: string
  certificateType: string
  certificateTitle: string
  issueDate: string
  expiryDate?: string
  status: string
  createdAt: Date
}

export async function generateCertificateHash(imageBuffer: Buffer, metadata: any): Promise<string> {
  const hash = crypto
    .createHash('sha256')
    .update(imageBuffer)
    .update(JSON.stringify(metadata))
    .digest('hex')
  
  return hash
}

export async function createCertificate(
  certificateHash: string,
  studentId: string,
  issuerId: string,
  certificateType: string,
  certificateTitle: string,
  issueDate: string,
  expiryDate?: string,
  imageUrl?: string
): Promise<Certificate> {
  const result = await queryDatabase(
    `INSERT INTO certificates (
      certificate_hash, student_id, issuer_id, certificate_type, certificate_title, issue_date, expiry_date, original_image_url, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, certificate_hash, student_id, issuer_id, certificate_type, certificate_title, issue_date, expiry_date, status, created_at`,
    [certificateHash, studentId, issuerId, certificateType, certificateTitle, issueDate, expiryDate || null, imageUrl || null, 'pending']
  )

  if (result.rows.length === 0) {
    throw new Error('Failed to create certificate')
  }

  const row = result.rows[0]
  return {
    id: row.id,
    certificateHash: row.certificate_hash,
    studentId: row.student_id,
    issuerId: row.issuer_id,
    certificateType: row.certificate_type,
    certificateTitle: row.certificate_title,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function getCertificateById(id: string): Promise<Certificate | null> {
  const result = await queryDatabase(
    `SELECT id, certificate_hash, student_id, issuer_id, certificate_type, certificate_title, issue_date, expiry_date, status, created_at
     FROM certificates WHERE id = $1`,
    [id]
  )

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    id: row.id,
    certificateHash: row.certificate_hash,
    studentId: row.student_id,
    issuerId: row.issuer_id,
    certificateType: row.certificate_type,
    certificateTitle: row.certificate_title,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function getCertificateByHash(hash: string): Promise<Certificate | null> {
  const result = await queryDatabase(
    `SELECT id, certificate_hash, student_id, issuer_id, certificate_type, certificate_title, issue_date, expiry_date, status, created_at
     FROM certificates WHERE certificate_hash = $1`,
    [hash]
  )

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    id: row.id,
    certificateHash: row.certificate_hash,
    studentId: row.student_id,
    issuerId: row.issuer_id,
    certificateType: row.certificate_type,
    certificateTitle: row.certificate_title,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function getCertificatesByStudentId(studentId: string): Promise<Certificate[]> {
  const result = await queryDatabase(
    `SELECT id, certificate_hash, student_id, issuer_id, certificate_type, certificate_title, issue_date, expiry_date, status, created_at
     FROM certificates WHERE student_id = $1 ORDER BY created_at DESC`,
    [studentId]
  )

  return result.rows.map((row) => ({
    id: row.id,
    certificateHash: row.certificate_hash,
    studentId: row.student_id,
    issuerId: row.issuer_id,
    certificateType: row.certificate_type,
    certificateTitle: row.certificate_title,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  }))
}

export async function updateCertificateStatus(id: string, status: string, blockchainTxId?: string): Promise<Certificate> {
  const result = await queryDatabase(
    `UPDATE certificates SET status = $1, blockchain_tx_id = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id, certificate_hash, student_id, issuer_id, certificate_type, certificate_title, issue_date, expiry_date, status, created_at`,
    [status, blockchainTxId || null, id]
  )

  if (result.rows.length === 0) {
    throw new Error('Certificate not found')
  }

  const row = result.rows[0]
  return {
    id: row.id,
    certificateHash: row.certificate_hash,
    studentId: row.student_id,
    issuerId: row.issuer_id,
    certificateType: row.certificate_type,
    certificateTitle: row.certificate_title,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function storeExtractedData(
  certificateId: string,
  recipientName: string,
  institutionName: string,
  certificateTitle: string,
  courseDetails: any,
  gradesScores: any,
  ocrConfidence: number
): Promise<any> {
  const result = await queryDatabase(
    `INSERT INTO extracted_data (
      certificate_id, recipient_name, institution_name, certificate_title, course_details, grades_scores, ocr_confidence, extraction_timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    RETURNING id, certificate_id, recipient_name`,
    [certificateId, recipientName, institutionName, certificateTitle, JSON.stringify(courseDetails), JSON.stringify(gradesScores), ocrConfidence]
  )

  return result.rows[0]
}

export async function storeValidationScore(
  certificateId: string,
  confidenceScore: number,
  validationType: string,
  modelVersion: string,
  modelDetails: any
): Promise<any> {
  const result = await queryDatabase(
    `INSERT INTO validation_scores (
      certificate_id, confidence_score, validation_type, model_version, model_details
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id, certificate_id, confidence_score`,
    [certificateId, confidenceScore, validationType, modelVersion, JSON.stringify(modelDetails)]
  )

  return result.rows[0]
}

export async function storeFraudDetectionResult(
  certificateId: string,
  isFraudDetected: boolean,
  fraudConfidence: number,
  fraudType?: string,
  anomalyDetails?: string,
  modelVersion?: string
): Promise<any> {
  const result = await queryDatabase(
    `INSERT INTO fraud_detection_results (
      certificate_id, is_fraud_detected, fraud_confidence, fraud_type, anomaly_details, model_version, requires_review
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, certificate_id, is_fraud_detected, fraud_confidence`,
    [certificateId, isFraudDetected, fraudConfidence, fraudType || null, anomalyDetails || null, modelVersion || null, fraudConfidence > 0.7]
  )

  return result.rows[0]
}
