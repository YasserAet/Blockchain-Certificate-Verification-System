/**
 * Formatting utility functions
 */

// Date formatting
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(
    dateObj
  )
}

export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return formatDateShort(dateObj)
}

// Number formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Blockchain formatting
export const formatBlockchainAddress = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address || address.length < startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

export const formatTransactionHash = (hash: string): string => {
  return formatBlockchainAddress(hash, 10, 8)
}

// Text formatting
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Status formatting
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map((word) => capitalize(word))
    .join(' ')
}

// Certificate hash formatting
export const formatCertificateHash = (hash: string): string => {
  if (!hash) return 'N/A'
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}

// Fraud score formatting
export const formatFraudScore = (score: number): {
  label: string
  color: string
} => {
  if (score < 0.3) {
    return { label: 'Low Risk', color: 'green' }
  } else if (score < 0.7) {
    return { label: 'Medium Risk', color: 'yellow' }
  } else {
    return { label: 'High Risk', color: 'red' }
  }
}

// Confidence score formatting
export const formatConfidenceScore = (score: number): string => {
  if (score >= 0.9) return 'Very High'
  if (score >= 0.7) return 'High'
  if (score >= 0.5) return 'Medium'
  if (score >= 0.3) return 'Low'
  return 'Very Low'
}

// Array formatting
export const formatList = (
  items: string[],
  maxItems: number = 3
): { display: string; hasMore: boolean } => {
  if (items.length <= maxItems) {
    return {
      display: items.join(', '),
      hasMore: false,
    }
  }

  const visible = items.slice(0, maxItems)
  return {
    display: `${visible.join(', ')} +${items.length - maxItems} more`,
    hasMore: true,
  }
}

// Email formatting
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@')
  if (!username || !domain) return email

  const visibleChars = Math.min(3, username.length - 1)
  const masked = username.slice(0, visibleChars) + '*'.repeat(5)
  return `${masked}@${domain}`
}

// Phone number formatting (US format)
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}
