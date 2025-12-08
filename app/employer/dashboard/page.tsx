'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Shield, FileCheck, Clock, Building2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface VerificationResult {
  certificate: {
    id: number
    title: string
    recipient_name: string
    recipient_email: string
    institution_name: string
    issue_date: string
    expiry_date: string | null
    status: string
    fraud_score: number | null
  }
  blockchain: {
    isVerified: boolean
    txHash: string | null
    blockNumber: number | null
  }
  isValid: boolean
  message: string
}

interface VerificationHistory {
  id: number
  certificate_id: number
  verified_at: string
  result: string
  certificate_title: string
}

export default function EmployerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'id' | 'hash'>('id')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [history, setHistory] = useState<VerificationHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'employer') {
      router.push(`/${parsedUser.role}/dashboard`)
      return
    }

    setUser(parsedUser)
    fetchVerificationHistory(token)
  }, [router])

  const fetchVerificationHistory = async (token: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/employer/verification-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setHistory(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch verification history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setVerificationResult(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const endpoint = searchType === 'id' 
        ? `${API_URL}/certificates/employer/${searchQuery}/verify`
        : `${API_URL}/certificates/employer/verify-by-hash/${searchQuery}`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationResult(data.data)
        // Refresh history
        fetchVerificationHistory(token)
      } else {
        alert(`Verification failed: ${data.message || 'Certificate not found'}`)
      }
    } catch (error) {
      console.error('Verification error:', error)
      alert('Failed to verify certificate')
    } finally {
      setVerifying(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    router.push('/login')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, <span className="text-accent">{user.name}</span>
            </h1>
            <p className="text-muted-foreground">Verify candidate credentials</p>
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
                <Search className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Verifications</p>
                <p className="text-2xl font-bold">{history.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Certificates</p>
                <p className="text-2xl font-bold">
                  {history.filter(h => h.result === 'valid').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invalid/Suspicious</p>
                <p className="text-2xl font-bold">
                  {history.filter(h => h.result === 'invalid' || h.result === 'suspicious').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <Card className="p-6 border-border/40">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent" />
              Verify Certificate
            </h2>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="searchType">Search By</Label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'id' | 'hash')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="id">Certificate ID</option>
                  <option value="hash">Blockchain Hash</option>
                </select>
              </div>

              <div>
                <Label htmlFor="searchQuery">
                  {searchType === 'id' ? 'Certificate ID' : 'Blockchain Transaction Hash'}
                </Label>
                <Input
                  id="searchQuery"
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'id' ? 'Enter certificate ID' : 'Enter blockchain hash'}
                />
              </div>

              <Button type="submit" className="w-full" disabled={verifying}>
                {verifying ? 'Verifying...' : 'Verify Certificate'}
              </Button>
            </form>

            {/* Verification Result */}
            {verificationResult && (
              <div className="mt-6 space-y-4">
                <div
                  className={`p-4 rounded-lg border ${
                    verificationResult.isValid
                      ? 'border-green-500/20 bg-green-500/5'
                      : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    {verificationResult.isValid ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <span className={`font-semibold ${verificationResult.isValid ? 'text-green-500' : 'text-red-500'}`}>
                      {verificationResult.message}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Title: </span>
                      <span className="font-medium">{verificationResult.certificate.title}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recipient: </span>
                      <span className="font-medium">{verificationResult.certificate.recipient_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span className="font-medium">{verificationResult.certificate.recipient_email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Institution: </span>
                      <span className="font-medium">{verificationResult.certificate.institution_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Issue Date: </span>
                      <span className="font-medium">
                        {new Date(verificationResult.certificate.issue_date).toLocaleDateString()}
                      </span>
                    </div>
                    {verificationResult.certificate.fraud_score !== null && (
                      <div>
                        <span className="text-muted-foreground">Fraud Score: </span>
                        <span className={`font-medium ${
                          Number(verificationResult.certificate.fraud_score) > 70 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {Number(verificationResult.certificate.fraud_score).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {verificationResult.blockchain.isVerified && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        Blockchain Verified
                      </p>
                      {verificationResult.blockchain.txHash && (
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          TX: {verificationResult.blockchain.txHash}
                        </p>
                      )}
                      {verificationResult.blockchain.blockNumber && (
                        <p className="text-xs text-muted-foreground">
                          Block: {verificationResult.blockchain.blockNumber}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Verification History */}
          <Card className="p-6 border-border/40">
            <h2 className="text-2xl font-bold mb-6">Verification History</h2>

            {loadingHistory ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No verification history yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-border/40 rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.certificate_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Certificate ID: {item.certificate_id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.result === 'valid'
                            ? 'bg-green-500/10 text-green-500'
                            : item.result === 'invalid'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}
                      >
                        {item.result}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {new Date(item.verified_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Guide */}
        <Card className="p-6 border-border/40 mt-8">
          <h2 className="text-xl font-bold mb-4">How to Verify Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-accent">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Get Certificate Details</h3>
                <p className="text-sm text-muted-foreground">
                  Ask the candidate for their certificate ID or blockchain transaction hash
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-accent">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enter & Verify</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the details in the verification form and click verify
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-accent">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Review Results</h3>
                <p className="text-sm text-muted-foreground">
                  Check the verification status, blockchain proof, and fraud score
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
