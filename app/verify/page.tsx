'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Shield, Search, FileCheck, AlertCircle, CheckCircle, XCircle, Clock, User, Building2, Calendar, Hash, Award, Fingerprint, Lock, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface VerificationResult {
  valid: boolean
  certificateId: string
  studentName: string
  institution: string
  degree: string
  issueDate: string
  verificationDate: string
  blockchainHash: string
  fraudScore: number
  status: 'verified' | 'invalid' | 'suspicious'
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
  const [certificateId, setCertificateId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock result - replace with actual API call
      const mockResult: VerificationResult = {
        valid: true,
        certificateId: certificateId,
        studentName: 'John Doe',
        institution: 'MIT - Massachusetts Institute of Technology',
        degree: 'Bachelor of Science in Computer Science',
        issueDate: '2024-06-15',
        verificationDate: new Date().toISOString().split('T')[0],
        blockchainHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        fraudScore: 0.02,
        status: 'verified'
      }

      setResult(mockResult)
    } catch (err) {
      setError('Failed to verify certificate. Please try again.')
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
                <label className="block text-sm font-medium mb-2">
                  Certificate ID or Blockchain Hash
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Enter certificate ID or 0x hash..."
                    required
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Example: CERT-2024-12345 or 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
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
              result.status === 'verified' 
                ? 'bg-green-500/10 border-green-500/30' 
                : result.status === 'suspicious'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-4">
                {result.status === 'verified' ? (
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                ) : result.status === 'suspicious' ? (
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {result.status === 'verified' ? 'Certificate Verified ✓' : 
                     result.status === 'suspicious' ? 'Suspicious Activity Detected' :
                     'Invalid Certificate'}
                  </h2>
                  <p className="text-muted-foreground">
                    {result.status === 'verified' ? 'This certificate is authentic and verified on the blockchain' :
                     result.status === 'suspicious' ? 'This certificate may be fraudulent. Please contact the institution' :
                     'This certificate could not be verified in our system'}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border-border/40">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Student Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                    <div className="font-medium">{result.studentName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Degree</div>
                    <div className="font-medium">{result.degree}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/40">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  Institution
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Issuing Institution</div>
                    <div className="font-medium">{result.institution}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Issue Date</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(result.issueDate).toLocaleDateString()}
                    </div>
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
                    {result.certificateId}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Blockchain Hash
                  </div>
                  <div className="font-mono text-sm bg-accent/10 p-2 rounded border border-accent/20 truncate">
                    {result.blockchainHash}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Verified On
                  </div>
                  <div className="font-medium">
                    {new Date(result.verificationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Fraud Detection */}
            <Card className="p-6 border-border/40">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                AI Fraud Detection Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Fraud Risk Score</span>
                    <span className="font-bold text-green-500">{(result.fraudScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${100 - (result.fraudScore * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Pattern Match', value: '98.5%', icon: CheckCircle },
                    { label: 'Signature Valid', value: '100%', icon: CheckCircle },
                    { label: 'Timestamp Valid', value: '100%', icon: CheckCircle },
                    { label: 'Issuer Verified', value: '100%', icon: CheckCircle }
                  ].map((check, index) => {
                    const Icon = check.icon
                    return (
                      <div key={index} className="text-center p-3 rounded-lg bg-accent/5 border border-accent/10">
                        <Icon className="w-5 h-5 text-green-500 mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground mb-1">{check.label}</div>
                        <div className="font-semibold text-sm">{check.value}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button variant="outline" className="gap-2">
                <FileCheck className="w-4 h-4" />
                Download Report
              </Button>
              <Button variant="outline" className="gap-2">
                <Award className="w-4 h-4" />
                View on Blockchain
              </Button>
              <Button 
                onClick={() => {
                  setResult(null)
                  setCertificateId('')
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <Search className="w-4 h-4" />
                Verify Another
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
