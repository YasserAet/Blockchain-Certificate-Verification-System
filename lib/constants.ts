/**
 * Constants used across the application
 */

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  CERTIFICATES: {
    BASE: '/certificates',
    UPLOAD: '/certificates/upload',
    VERIFY: '/certificates/verify',
  },
  INSTITUTION: {
    CERTIFICATES: '/institution/certificates',
    ISSUE: '/institution/issue-certificate',
    FRAUD_ALERTS: '/institution/fraud-alerts',
  },
  EMPLOYER: {
    VERIFICATIONS: '/employer/verifications',
    VERIFY: '/employer/verify-certificate',
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    HEALTH: '/admin/health',
  },
}

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTITUTION: 'institution',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Certificate statuses
export const CERTIFICATE_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
} as const

export type CertificateStatus =
  (typeof CERTIFICATE_STATUS)[keyof typeof CERTIFICATE_STATUS]

// Fraud alert statuses
export const FRAUD_ALERT_STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  FALSE_POSITIVE: 'false_positive',
} as const

// File upload settings
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['.pdf', '.jpg', '.jpeg', '.png'],
  ACCEPTED_MIME_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ],
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// Routes by role
export const ROLE_ROUTES: Record<UserRole, string> = {
  student: '/student/dashboard',
  institution: '/institution/dashboard',
  employer: '/employer/dashboard',
  admin: '/admin/dashboard',
}

// Blockchain networks
export const BLOCKCHAIN_NETWORKS = {
  LOCALHOST: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
  },
} as const

// Status colors for UI
export const STATUS_COLORS = {
  verified: 'bg-green-500/20 text-green-400 border-green-500/50',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
  flagged: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  active: 'bg-green-500/20 text-green-400',
  inactive: 'bg-gray-500/20 text-gray-400',
  suspended: 'bg-red-500/20 text-red-400',
}

// Fraud score thresholds
export const FRAUD_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.7,
  HIGH: 1.0,
}

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in',
    LOGOUT: 'Successfully logged out',
    UPLOAD: 'Certificate uploaded successfully',
    ISSUE: 'Certificate issued successfully',
    VERIFY: 'Certificate verified successfully',
  },
  ERROR: {
    LOGIN: 'Login failed. Please check your credentials',
    NETWORK: 'Network error. Please try again',
    UPLOAD: 'Failed to upload certificate',
    GENERIC: 'An error occurred. Please try again',
  },
}

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  WITH_TIME: 'MM/DD/YYYY HH:mm',
}
