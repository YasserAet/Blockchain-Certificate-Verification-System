'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, FileCheck, Shield, Calendar, Building2, Download, Eye, Copy, Check, Hash } from 'lucide-react'

interface Certificate {
  id: number
  title: string
  institution_name: string
  issue_date: string
  expiry_date: string | null
  status: string
  blockchain_tx_hash: string | null
  fraud_score: number | null
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [copiedHash, setCopiedHash] = useState<number | null>(null)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))

    // Fetch certificates
    fetchCertificates(token)
  }, [router])

  const fetchCertificates = async (token: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/certificates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCertificates(data.data.certificates || [])
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    router.push('/login')
  }

  const copyToClipboard = (text: string, type: 'id' | 'hash', certId: number) => {
    navigator.clipboard.writeText(text)
    if (type === 'id') {
      setCopiedId(certId)
      setTimeout(() => setCopiedId(null), 2000)
    } else {
      setCopiedHash(certId)
      setTimeout(() => setCopiedHash(null), 2000)
    }
  }

  const handleDownload = async (certId: number, title: string) => {
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/certificates/${certId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/\s+/g, '_')}_certificate.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Download failed. Certificate file not found.')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download certificate')
    }
  }

  const handleView = (cert: Certificate) => {
    setSelectedCert(cert)
  }

  const closeModal = () => {
    setSelectedCert(null)
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-accent">{user.name}</span>
            </h1>
            <p className="text-muted-foreground">Manage your certificates and credentials</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">
                  {certificates.filter(c => c.status === 'verified').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {certificates.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Certificates List */}
        <Card className="p-6 border-border/40">
          <h2 className="text-2xl font-bold mb-6">My Certificates</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No certificates yet</p>
              <p className="text-sm text-muted-foreground">
                Your certificates will appear here once institutions issue them to you.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-border/40 rounded-lg p-6 hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{cert.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cert.status === 'verified'
                              ? 'bg-green-500/10 text-green-500'
                              : cert.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {cert.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>{cert.institution_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Certificate ID and Hash with Copy Buttons */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Certificate ID:</span>
                          <code className="px-2 py-1 bg-muted rounded text-accent font-mono">{cert.id}</code>
                          <button
                            onClick={() => copyToClipboard(cert.id.toString(), 'id', cert.id)}
                            className="p-1 hover:bg-accent/10 rounded transition-colors"
                            title="Copy Certificate ID"
                          >
                            {copiedId === cert.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>

                        {cert.blockchain_tx_hash && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Blockchain Hash:</span>
                            <code className="px-2 py-1 bg-muted rounded text-accent font-mono text-xs">
                              {cert.blockchain_tx_hash.slice(0, 16)}...
                            </code>
                            <button
                              onClick={() => copyToClipboard(cert.blockchain_tx_hash || '', 'hash', cert.id)}
                              className="p-1 hover:bg-accent/10 rounded transition-colors"
                              title="Copy Blockchain Hash"
                            >
                              {copiedHash === cert.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {cert.blockchain_tx_hash && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                          <Shield className="w-3 h-3" />
                          <span>Blockchain Verified</span>
                        </div>
                      )}

                      {cert.fraud_score !== null && cert.fraud_score > 0 && (
                        <div className="mt-2 text-xs text-yellow-500">
                          Fraud Risk Score: {Number(cert.fraud_score).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(cert)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(cert.id, cert.title)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* View Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Certificate Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Title</label>
                  <p className="text-lg font-semibold">{selectedCert.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Institution</label>
                    <p className="font-medium">{selectedCert.institution_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedCert.status === 'verified'
                            ? 'bg-green-500/10 text-green-500'
                            : selectedCert.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {selectedCert.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Issue Date</label>
                    <p className="font-medium">{new Date(selectedCert.issue_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Expiry Date</label>
                    <p className="font-medium">
                      {selectedCert.expiry_date 
                        ? new Date(selectedCert.expiry_date).toLocaleDateString() 
                        : 'No expiry'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">Certificate ID</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1 bg-background rounded font-mono text-accent">
                          {selectedCert.id}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedCert.id.toString(), 'id', selectedCert.id)}
                          className="p-2 hover:bg-accent/10 rounded transition-colors"
                          title="Copy Certificate ID"
                        >
                          {copiedId === selectedCert.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {selectedCert.blockchain_tx_hash && (
                      <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">Blockchain Hash</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1 bg-background rounded font-mono text-accent text-xs">
                            {selectedCert.blockchain_tx_hash.slice(0, 20)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(selectedCert.blockchain_tx_hash || '', 'hash', selectedCert.id)}
                            className="p-2 hover:bg-accent/10 rounded transition-colors"
                            title="Copy Blockchain Hash"
                          >
                            {copiedHash === selectedCert.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedCert.fraud_score !== null && (
                      <div className="p-3 bg-accent/5 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Fraud Risk Score</span>
                          <span className={`text-sm font-bold ${
                            Number(selectedCert.fraud_score) < 30 ? 'text-green-500' :
                            Number(selectedCert.fraud_score) < 70 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {Number(selectedCert.fraud_score).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handleDownload(selectedCert.id, selectedCert.title)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  )
}
