import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const ALGORITHM = 'aes-256-cbc'

export function encryptBuffer(buffer: Buffer): { encrypted: Buffer; iv: string } {
  const iv = crypto.randomBytes(16)
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(buffer)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  
  return {
    encrypted,
    iv: iv.toString('hex'),
  }
}

export function decryptBuffer(encryptedBuffer: Buffer, iv: string): Buffer {
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'))
  
  let decrypted = decipher.update(encryptedBuffer)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  
  return decrypted
}

export function encryptString(text: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16)
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  return {
    encrypted,
    iv: iv.toString('hex'),
  }
}

export function decryptString(encrypted: string, iv: string): string {
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

export function hashString(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex')
}
