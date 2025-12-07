/**
 * Validation utility functions
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password: string): boolean => {
  const minLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  return minLength && hasUpperCase && hasLowerCase && hasNumber
}

export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak'
  if (password.length < 10) return 'medium'

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const strength =
    [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean)
      .length

  if (strength >= 3 && password.length >= 10) return 'strong'
  if (strength >= 2) return 'medium'
  return 'weak'
}

// File validation
export const isValidFileType = (file: File, acceptedTypes: string[]): boolean => {
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
  return acceptedTypes.includes(fileExtension)
}

export const isValidFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes
}

// Date validation
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
}

export const isPastDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  const now = new Date()
  return date < now
}

// Blockchain address validation
export const isValidBlockchainAddress = (address: string): boolean => {
  // Ethereum address format (0x + 40 hex characters)
  const addressRegex = /^0x[a-fA-F0-9]{40}$/
  return addressRegex.test(address)
}

// Certificate hash validation
export const isValidCertificateHash = (hash: string): boolean => {
  // SHA-256 hash format (64 hex characters)
  const hashRegex = /^[a-fA-F0-9]{64}$/
  return hashRegex.test(hash)
}

// Form validation
export const validateLoginForm = (
  email: string,
  password: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid email format'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateRegisterForm = (data: {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (!data.email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.password) {
    errors.password = 'Password is required'
  } else if (!isValidPassword(data.password)) {
    errors.password =
      'Password must be at least 8 characters with uppercase, lowercase, and number'
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateCertificateUpload = (
  file: File | null,
  metadata: { certificateTitle: string; issuer: string; issueDate: string }
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!file) {
    errors.file = 'Please select a file'
  } else {
    const acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png']
    if (!isValidFileType(file, acceptedTypes)) {
      errors.file = 'Invalid file type. Please upload PDF, JPG, or PNG'
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (!isValidFileSize(file, maxSize)) {
      errors.file = 'File size exceeds 10MB limit'
    }
  }

  if (!metadata.certificateTitle.trim()) {
    errors.certificateTitle = 'Certificate title is required'
  }

  if (!metadata.issuer.trim()) {
    errors.issuer = 'Issuer is required'
  }

  if (!metadata.issueDate) {
    errors.issueDate = 'Issue date is required'
  } else if (!isValidDate(metadata.issueDate)) {
    errors.issueDate = 'Invalid date format'
  } else if (isFutureDate(metadata.issueDate)) {
    errors.issueDate = 'Issue date cannot be in the future'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
