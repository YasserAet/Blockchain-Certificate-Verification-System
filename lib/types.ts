/**
 * Type definitions for the application
 */

// User types
export interface User {
  id: string
  email: string
  fullName: string
  role: 'student' | 'institution' | 'employer' | 'admin'
  createdAt: string
  updatedAt: string
  status: 'active' | 'suspended' | 'inactive'
}

// Certificate types
export interface Certificate {
  id: string
  userId: string
  certificateTitle: string
  issuer: string
  issueDate: string
  expiryDate?: string
  status: 'pending' | 'verified' | 'rejected' | 'flagged'
  blockchainHash?: string
  fraudScore?: number
  extractedSkills?: string[]
  fileUrl?: string
  metadata?: CertificateMetadata
  createdAt: string
  updatedAt: string
}

export interface CertificateMetadata {
  courseCode?: string
  grade?: string
  description?: string
  studentName?: string
  studentEmail?: string
  [key: string]: any
}

// Verification result
export interface VerificationResult {
  valid: boolean
  confidenceScore: number
  certificateTitle: string
  issuer: string
  issueDate: string
  issuerVerified: boolean
  blockchainHash: string
  fraudScore: number
  extractedSkills: string[]
  warnings: string[]
}

// Fraud alert
export interface FraudAlert {
  id: string
  certificateId: string
  studentName: string
  certificateTitle: string
  fraudType: string
  confidence: number
  detectedAt: string
  status: 'pending' | 'resolved' | 'false_positive'
  details?: string
}

// Stats
export interface SystemStats {
  totalUsers: number
  totalCertificates: number
  fraudAlertsCount: number
  blockchainTxCount: number
}

export interface InstitutionStats {
  totalIssued: number
  verified: number
  fraudAlerts: number
}

export interface EmployerStats {
  totalVerified: number
  valid: number
  suspicious: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  role: string
}

export interface UploadCertificateFormData {
  file: File | null
  certificateTitle: string
  issuer: string
  issueDate: string
}

export interface IssueCertificateFormData {
  studentEmail: string
  studentName: string
  certificateTitle: string
  courseCode?: string
  issueDate: string
  expiryDate?: string
  grade?: string
  description?: string
}

// Blockchain types
export interface BlockchainCertificate {
  issuer: string
  timestamp: number
  isValid: boolean
  fraudScore?: number
}

export interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  gasUsed: string
  status: number
}

// ML Service types
export interface SkillExtractionResult {
  skills: string[]
  confidence: number
  categories: string[]
}

export interface FraudDetectionResult {
  isFraudulent: boolean
  fraudScore: number
  fraudType?: string
  reasons: string[]
}

export interface OCRResult {
  text: string
  confidence: number
  extractedFields: Record<string, any>
}

// Navigation items
export interface NavItem {
  href: string
  label: string
  icon: string
}

// Table types
export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => any
}

// Filter types
export interface FilterOption {
  label: string
  value: string
}

// Search types
export interface SearchParams {
  query?: string
  filters?: Record<string, any>
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
