import axios from 'axios'
import { storeExtractedData, storeValidationScore, storeFraudDetectionResult } from './certificate.service'

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

export interface MLProcessingResult {
  ocr: {
    text: string
    confidence: number
  }
  classification: {
    type: string
    confidence: number
  }
  fraudDetection: {
    isFraud: boolean
    confidence: number
    fraudType?: string
    anomalyDetails?: string
  }
  extractedData: {
    recipientName: string
    institution: string
    certificateTitle: string
    issueDate?: string
    grades?: any
  }
}

export async function processCertificateWithML(
  certificateId: string,
  imageBase64: string
): Promise<MLProcessingResult> {
  try {
    console.log(`[ML Service] Processing certificate: ${certificateId}`)

    const response = await axios.post(`${ML_SERVICE_URL}/api/process-certificate`, {
      certificate_id: certificateId,
      image: imageBase64,
    })

    const result = response.data

    console.log(`[ML Service] Processing complete for certificate: ${certificateId}`)

    return result
  } catch (error: any) {
    console.error('[ML Service] Processing failed:', error.message)
    throw new Error(`ML service error: ${error.message}`)
  }
}

export async function runOCR(imageBase64: string): Promise<any> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ocr`, {
      image: imageBase64,
    })

    return response.data
  } catch (error: any) {
    console.error('[ML Service] OCR failed:', error.message)
    throw error
  }
}

export async function classifyDocument(imageBase64: string): Promise<any> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/classify`, {
      image: imageBase64,
    })

    return response.data
  } catch (error: any) {
    console.error('[ML Service] Classification failed:', error.message)
    throw error
  }
}

export async function detectFraud(imageBase64: string): Promise<any> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/fraud-detect`, {
      image: imageBase64,
    })

    return response.data
  } catch (error: any) {
    console.error('[ML Service] Fraud detection failed:', error.message)
    throw error
  }
}

export async function extractSkills(certificateData: any): Promise<string[]> {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/extract-skills`, {
      certificate_data: certificateData,
    })

    return response.data.skills || []
  } catch (error: any) {
    console.error('[ML Service] Skill extraction failed:', error.message)
    throw error
  }
}

export async function storeCertificateMLResults(
  certificateId: string,
  mlResults: MLProcessingResult
): Promise<void> {
  try {
    // Store extracted data
    await storeExtractedData(
      certificateId,
      mlResults.extractedData.recipientName,
      mlResults.extractedData.institution,
      mlResults.extractedData.certificateTitle,
      mlResults.extractedData.grades || {},
      {},
      mlResults.ocr.confidence
    )

    // Store validation score
    await storeValidationScore(
      certificateId,
      mlResults.classification.confidence,
      'authenticity',
      'v1.0',
      { model: 'mobilenet-v2', type: 'certificate-classification' }
    )

    // Store fraud detection result
    await storeFraudDetectionResult(
      certificateId,
      mlResults.fraudDetection.isFraud,
      mlResults.fraudDetection.confidence,
      mlResults.fraudDetection.fraudType,
      mlResults.fraudDetection.anomalyDetails,
      'v1.0'
    )

    console.log(`[ML Service] Stored results for certificate: ${certificateId}`)
  } catch (error: any) {
    console.error('[ML Service] Storage failed:', error)
    throw error
  }
}

export async function isMLServiceHealthy(): Promise<boolean> {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 })
    return response.status === 200
  } catch (error) {
    console.error('[ML Service] Health check failed')
    return false
  }
}
