'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  status: 'pending' | 'verified' | 'flagged'
  blockchainHash?: string
}

export default function StudentDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch certificates from backend
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/certificates', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCertificates(data.certificates)
        }
      } catch (err) {
        console.error('Failed to fetch certificates:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'flagged':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default:
        return 'bg-muted/20 text-muted border-muted/50'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted mt-1">Manage and share your verified credentials</p>
        </div>
        <Link href="/student/upload">
          <Button className="bg-accent hover:bg-accent-light text-accent-foreground">
            Upload Certificate
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        <Card className="glass-effect">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Portfolio Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 border border-border rounded-lg">
                <div className="text-sm text-muted mb-1">Total Certificates</div>
                <div className="text-2xl font-bold text-accent">{certificates.length}</div>
              </div>
              <div className="p-4 bg-primary/10 border border-border rounded-lg">
                <div className="text-sm text-muted mb-1">Verified</div>
                <div className="text-2xl font-bold text-green-400">
                  {certificates.filter(c => c.status === 'verified').length}
                </div>
              </div>
              <div className="p-4 bg-primary/10 border border-border rounded-lg">
                <div className="text-sm text-muted mb-1">Pending Review</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {certificates.filter(c => c.status === 'pending').length}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Certificates</h2>
        {loading ? (
          <Card className="glass-effect p-8">
            <div className="text-center text-muted">Loading certificates...</div>
          </Card>
        ) : certificates.length === 0 ? (
          <Card className="glass-effect p-8">
            <div className="text-center">
              <p className="text-muted mb-4">No certificates yet</p>
              <Link href="/student/upload">
                <Button className="bg-accent hover:bg-accent-light text-accent-foreground">
                  Upload Your First Certificate
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="glass-effect">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{cert.title}</h3>
                      <p className="text-sm text-muted">{cert.issuer}</p>
                      <p className="text-xs text-muted mt-2">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(cert.status)}`}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </div>
                      <Link href={`/student/certificate/${cert.id}`}>
                        <Button variant="outline" className="border-border text-foreground hover:bg-primary/10">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
