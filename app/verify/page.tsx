'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Shield, Search, FileCheck, AlertCircle, CheckCircle, XCircle, Clock, User, Building2, Calendar, Hash, Award, Fingerprint, Lock, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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
    description: string | null
  }
  blockchain: {
    isVerified: boolean
    txHash: string | null
    blockNumber: number | null
  }
  isValid: boolean
  message: string
}

const verificationSteps = [
  {
    icon: Search,
    title: 'Search',
    description: 'Enter certificate ID or hash'
  },
  {
    icon: Shield,
    title: 'Blockchain Check',
    description: 'Verify on blockchain'
  },
  {
    icon: Zap,
    title: 'AI Analysis',
    description: 'Fraud detection scan'
  },
  {
    icon: CheckCircle,
    title: 'Results',
    description: 'Instant verification'
  }
]

export default function VerifyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'id' | 'hash'>('id')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const endpoint = searchType === 'id' 
        ? `${API_URL}/certificates/${searchQuery}/verify`
        : `${API_URL}/certificates/verify-by-hash/${searchQuery}`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Certificate not found or verification failed')
      }

      const data = await response.json()
      setResult(data.data)
    } catch (err: any) {
      setError(err.message || 'Failed to verify certificate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(var(--accent-rgb),0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Instant Verification
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Verify Credentials{' '}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enter a certificate ID or blockchain hash to verify its authenticity using our secure blockchain network
            </p>
          </div>

          {/* Verification Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/20 mb-3">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>

          {/* Verification Form */}
          <Card className="max-w-3xl mx-auto p-8 border-border/40 shadow-xl">
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <Label htmlFor="searchType">Search By</Label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'id' | 'hash')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background mb-4"
                >
                  <option value="id">Certificate ID</option>
                  <option value="hash">Blockchain Hash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {searchType === 'id' ? 'Certificate ID' : 'Blockchain Transaction Hash'}
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === 'id' ? 'Enter certificate ID (e.g., 1)' : 'Enter blockchain hash (0x...)'}
                    required
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchType === 'id' 
                    ? 'Enter the numeric certificate ID'
                    : 'Enter the blockchain transaction hash starting with 0x'
                  }
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all group h-12 text-base"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
                    Verifying on Blockchain...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Verify Certificate
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-12 bg-gradient-to-b from-accent/5 to-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Status Banner */}
            <div className={`p-6 rounded-2xl mb-8 border-2 ${
              result.isValid 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-4">
                {result.isValid ? (
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {result.isValid ? 'Certificate Verified ✓' : 'Invalid Certificate'}
                  </h2>
                  <p className="text-muted-foreground">
                    {result.message}
                  </p>
                </div>
              </div>

              {/* Fraud Score Warning */}
              {result.certificate.fraud_score !== null && Number(result.certificate.fraud_score) > 70 && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-500 font-semibold">
                      High Fraud Risk Detected: {result.certificate.fraud_score.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This certificate has been flagged by our AI fraud detection system. Please verify directly with the institution.
                  </p>
                </div>
              )}
            </div>

            {/* Certificate Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border-border/40">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Recipient Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                    <div className="font-medium">{result.certificate.recipient_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-medium">{result.certificate.recipient_email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Certificate Title</div>
                    <div className="font-medium">{result.certificate.title}</div>
                  </div>
                  {result.certificate.description && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Description</div>
                      <div className="text-sm">{result.certificate.description}</div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  Institution Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Issuing Institution</div>
                    <div className="font-medium">{result.certificate.institution_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Issue Date</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(result.certificate.issue_date).toLocaleDateString()}
                    </div>
                  </div>
                  {result.certificate.expiry_date && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Expiry Date</div>
                      <div className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(result.certificate.expiry_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      result.certificate.status === 'verified'
                        ? 'bg-green-500/10 text-green-500'
                        : result.certificate.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {result.certificate.status}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Blockchain Info */}
            <Card className="p-6 border-border/40 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                Blockchain Verification
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" />
                    Certificate ID
                  </div>
                  <div className="font-mono text-sm bg-accent/10 p-2 rounded border border-accent/20">
                    {result.certificate.id}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Blockchain Hash
                  </div>
                  <div className="font-mono text-sm bg-accent/10 p-2 rounded border border-accent/20 truncate">
                    {result.blockchain.txHash || 'Pending'}
                  </div>
                </div>
                {result.blockchain.blockNumber && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Block Number
                    </div>
                    <div className="font-medium">
                      #{result.blockchain.blockNumber}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Blockchain Status
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.blockchain.isVerified
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {result.blockchain.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </Card>

            {/* AI Fraud Detection */}
            {result.certificate.fraud_score !== null && (
              <Card className="p-6 border-border/40 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  AI Fraud Detection Analysis
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Fraud Risk Score</span>
                      <span className={`font-bold ${
                        Number(result.certificate.fraud_score) > 70 ? 'text-red-500' : 
                        Number(result.certificate.fraud_score) > 40 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        {Number(result.certificate.fraud_score).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          Number(result.certificate.fraud_score) > 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                          Number(result.certificate.fraud_score) > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${Number(result.certificate.fraud_score)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Number(result.certificate.fraud_score) < 30 ? (
                      '✓ Low fraud risk - Certificate appears authentic'
                    ) : Number(result.certificate.fraud_score) < 70 ? (
                      '⚠ Moderate fraud risk - Review recommended'
                    ) : (
                      '⚠ High fraud risk - Contact institution for verification'
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button 
                onClick={() => {
                  setResult(null)
                  setSearchQuery('')
                }}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Verify Another Certificate
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Verification Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-layered verification process ensures the highest level of security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: 'Blockchain Verification',
                description: 'Every certificate is stored on an immutable blockchain ledger that cannot be altered or tampered with.'
              },
              {
                icon: Zap,
                title: 'AI Fraud Detection',
                description: 'Advanced machine learning algorithms analyze patterns and detect potential fraudulent certificates with 99.8% accuracy.'
              },
              {
                icon: Shield,
                title: 'Cryptographic Security',
                description: 'Military-grade encryption and digital signatures ensure authenticity and protect against forgery.'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="p-6 border-border/40 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10 text-center group">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
