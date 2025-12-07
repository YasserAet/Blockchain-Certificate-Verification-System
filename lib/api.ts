/**
 * API Service - Centralized API calls
 */

const API_URL = typeof window !== 'undefined' 
  ? (window as any).NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  : 'http://localhost:3001/api'

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }))
    throw new Error(error.message || `API call failed: ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string
    password: string
    fullName: string
    role: string
  }) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => apiCall('/auth/logout', { method: 'POST' }),
}

// Certificate API
export const certificateAPI = {
  getAll: () => apiCall('/certificates'),

  getById: (id: string) => apiCall(`/certificates/${id}`),

  upload: async (file: File, metadata: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('metadata', JSON.stringify(metadata))

    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/certificates/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  },

  verify: (certificateHash: string) =>
    apiCall('/certificates/verify', {
      method: 'POST',
      body: JSON.stringify({ certificateHash }),
    }),
}

// Institution API
export const institutionAPI = {
  getCertificates: () => apiCall('/institution/certificates'),

  issueCertificate: (data: any) =>
    apiCall('/institution/issue-certificate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getFraudAlerts: (status?: string) =>
    apiCall(`/institution/fraud-alerts${status ? `?status=${status}` : ''}`),

  resolveFraudAlert: (alertId: string, resolution: string) =>
    apiCall(`/institution/fraud-alerts/${alertId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: resolution }),
    }),
}

// Employer API
export const employerAPI = {
  getVerifications: () => apiCall('/employer/verifications'),

  verifyCertificate: (certificateHash: string) =>
    apiCall('/employer/verify-certificate', {
      method: 'POST',
      body: JSON.stringify({ certificateHash }),
    }),
}

// Admin API
export const adminAPI = {
  getStats: () => apiCall('/admin/stats'),

  getUsers: (role?: string) =>
    apiCall(`/admin/users${role ? `?role=${role}` : ''}`),

  suspendUser: (userId: string) =>
    apiCall(`/admin/users/${userId}/suspend`, {
      method: 'POST',
    }),

  getSystemHealth: () => apiCall('/admin/health'),
}

// ML Service API
export const mlAPI = {
  extractSkills: (certificateId: string) =>
    apiCall('/ml/extract-skills', {
      method: 'POST',
      body: JSON.stringify({ certificateId }),
    }),

  detectFraud: (certificateId: string) =>
    apiCall('/ml/detect-fraud', {
      method: 'POST',
      body: JSON.stringify({ certificateId }),
    }),
}
