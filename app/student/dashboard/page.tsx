'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, FileCheck, Shield, Calendar, Building2, Download, Eye } from 'lucide-react'

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

                      {cert.blockchain_tx_hash && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                          <Shield className="w-3 h-3" />
                          <span>Blockchain Verified</span>
                        </div>
                      )}

                      {cert.fraud_score !== null && cert.fraud_score > 0 && (
                        <div className="mt-2 text-xs text-yellow-500">
                          Fraud Risk Score: {(cert.fraud_score * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/verify?id=${cert.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
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
    </main>
  )
}
