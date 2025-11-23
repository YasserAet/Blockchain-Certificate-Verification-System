'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface VerificationRecord {
  id: string
  candidateName: string
  certificateTitle: string
  verificationDate: string
  status: 'valid' | 'invalid' | 'suspicious'
  confidenceScore: number
}

export default function EmployerDashboard() {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([])
  const [stats, setStats] = useState({
    totalVerified: 0,
    valid: 0,
    suspicious: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/employer/verifications', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setVerifications(data.verifications)
          setStats(data.stats)
        }
      } catch (err) {
        console.error('Failed to fetch verifications:', err)
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
          <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
          <p className="text-muted mt-1">Verify candidate credentials instantly</p>
        </div>
        <Link href="/employer/verify">
          <Button className="bg-accent hover:bg-accent-light text-accent-foreground">
            Verify Credential
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-effect p-6">
          <div className="text-sm text-muted mb-1">Total Verified</div>
          <div className="text-3xl font-bold text-accent">{stats.totalVerified}</div>
          <p className="text-xs text-muted mt-2">Credentials checked</p>
        </Card>

        <Card className="glass-effect p-6">
          <div className="text-sm text-muted mb-1">Valid</div>
          <div className="text-3xl font-bold text-green-400">{stats.valid}</div>
          <p className="text-xs text-muted mt-2">Verified authentic</p>
        </Card>

        <Card className="glass-effect p-6">
          <div className="text-sm text-muted mb-1">Suspicious</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.suspicious}</div>
          <p className="text-xs text-muted mt-2">Requires review</p>
        </Card>
      </div>

      <Card className="glass-effect">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Verifications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted">Candidate</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Certificate</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Verified</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Confidence</th>
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
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted">
                    No verifications yet
                  </td>
                </tr>
              ) : (
                verifications.map((v) => (
                  <tr key={v.id} className="border-b border-border hover:bg-primary/20">
                    <td className="px-6 py-4 text-foreground">{v.candidateName}</td>
                    <td className="px-6 py-4 text-foreground">{v.certificateTitle}</td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(v.verificationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-medium">
                        {(v.confidenceScore * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          v.status === 'valid'
                            ? 'bg-green-500/20 text-green-400'
                            : v.status === 'invalid'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
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
