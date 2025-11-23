import { encryptBuffer, decryptBuffer } from './encryption.service'
import { queryDatabase } from './database'
import fs from 'fs'
import path from 'path'

const STORAGE_DIR = process.env.STORAGE_DIR || './storage'

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true })
}

export interface StoredFile {
  id: string
  filename: string
  mimeType: string
  size: number
  encryptedPath: string
  iv: string
  certificateId: string
  uploadedAt: Date
}

export async function storeEncryptedFile(
  fileBuffer: Buffer,
  mimeType: string,
  certificateId: string
): Promise<StoredFile> {
  const { encrypted, iv } = encryptBuffer(fileBuffer)
  
  const filename = `${certificateId}_${Date.now()}`
  const encryptedPath = path.join(STORAGE_DIR, filename)
  
  // Write encrypted file to disk
  fs.writeFileSync(encryptedPath, encrypted)
  
  // Store metadata in database
  const result = await queryDatabase(
    `INSERT INTO certificate_files (certificate_id, filename, mime_type, file_size, encrypted_path, encryption_iv)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, filename, mime_type, file_size, encrypted_path, encryption_iv, uploaded_at`,
    [certificateId, filename, mimeType, fileBuffer.length, encryptedPath, iv]
  )

  if (result.rows.length === 0) {
    throw new Error('Failed to store file')
  }

  const row = result.rows[0]
  return {
    id: row.id,
    filename: row.filename,
    mimeType: row.mime_type,
    size: row.file_size,
    encryptedPath: row.encrypted_path,
    iv: row.encryption_iv,
    certificateId,
    uploadedAt: row.uploaded_at,
  }
}

export async function retrieveEncryptedFile(certificateId: string): Promise<Buffer> {
  const result = await queryDatabase(
    `SELECT encrypted_path, encryption_iv FROM certificate_files WHERE certificate_id = $1 LIMIT 1`,
    [certificateId]
  )

  if (result.rows.length === 0) {
    throw new Error('File not found')
  }

  const { encrypted_path, encryption_iv } = result.rows[0]
  
  // Read encrypted file from disk
  const encryptedBuffer = fs.readFileSync(encrypted_path)
  
  // Decrypt and return
  return decryptBuffer(encryptedBuffer, encryption_iv)
}

export async function deleteStoredFile(certificateId: string): Promise<void> {
  const result = await queryDatabase(
    `SELECT encrypted_path FROM certificate_files WHERE certificate_id = $1`,
    [certificateId]
  )

  if (result.rows.length > 0) {
    const { encrypted_path } = result.rows[0]
    if (fs.existsSync(encrypted_path)) {
      fs.unlinkSync(encrypted_path)
    }
  }

  // Delete metadata from database
  await queryDatabase(
    `DELETE FROM certificate_files WHERE certificate_id = $1`,
    [certificateId]
  )
}

export function base64ToBuffer(base64String: string): Buffer {
  const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String
  return Buffer.from(base64Data, 'base64')
}

export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64')
}
