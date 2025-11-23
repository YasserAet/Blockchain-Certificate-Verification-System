'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface IssuedCertificate {
  id: string
  studentName: string
  certificateTitle: string
  issueDate: string
  status: 'pending' | 'verified' | 'rejected'
  fraudScore: number
}

export default function InstitutionDashboard() {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([])
  const [stats, setStats] = useState({
    totalIssued: 0,
    verified: 0,
    fraudAlerts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/institution/certificates', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setCertificates(data.certificates)
          setStats(data.stats)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Institution Dashboard</h1>
          <p className="text-muted mt-1">Manage issued certificates and monitor fraud alerts</p>
        </div>
        <Link href="/institution/issue">
          <Button className="bg-accent hover:bg-accent-light text-accent-foreground">
            Issue Certificate
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-effect p-6">
          <div className="text-sm text-muted mb-1">Total Issued</div>
          <div className="text-3xl font-bold text-accent">{stats.totalIssued}</div>
          <p className="text-xs text-muted mt-2">Certificates issued</p>
        </Card>

        <Card className="glass-effect p-6">
          <div className="text-sm text-muted mb-1">Verified</div>
          <div className="text-3xl font-bold text-green-400">{stats.verified}</div>
          <p className="text-xs text-muted mt-2">Successfully verified on blockchain</p>
        </Card>

        <Card className="glass-effect p-6">
          <div className="text-sm text-muted mb-1">Fraud Alerts</div>
          <div className="text-3xl font-bold text-red-400">{stats.fraudAlerts}</div>
          <p className="text-xs text-muted mt-2">Requires review</p>
        </Card>
      </div>

      <Card className="glass-effect">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Certificates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted">Student</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Certificate</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Fraud Score</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted">
                    No certificates issued yet
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-border hover:bg-primary/20">
                    <td className="px-6 py-4 text-foreground">{cert.studentName}</td>
                    <td className="px-6 py-4 text-foreground">{cert.certificateTitle}</td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              cert.fraudScore > 0.7
                                ? 'bg-red-500'
                                : cert.fraudScore > 0.3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${cert.fraudScore * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">
                          {(cert.fraudScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cert.status === 'verified'
                            ? 'bg-green-500/20 text-green-400'
                            : cert.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
