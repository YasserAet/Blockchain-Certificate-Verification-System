'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface VerificationResult {
  valid: boolean
  confidenceScore: number
  certificateTitle: string
  issuer: string
  issueDate: string
  issuerVerified: boolean
  blockchainHash: string
  fraudScore: number
  extractedSkills: string[]
  warnings: string[]
}

export default function VerifyCredential() {
  const [certificateHash, setCertificateHash] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/employer/verify-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ certificateHash }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Verification failed')
        return
      }

      setResult(data.result)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verify Credential</h1>
        <p className="text-muted mt-1">Instantly verify candidate certificates on blockchain</p>
      </div>

      <Card className="glass-effect">
        <div className="p-8">
          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Certificate Hash or QR Code
              </label>
              <Input
                type="text"
                value={certificateHash}
                onChange={(e) => setCertificateHash(e.target.value)}
                placeholder="Paste certificate hash or scan QR code"
                className="w-full font-mono text-xs"
              />
              <p className="text-xs text-muted mt-2">
                Ask the candidate for their certificate QR code or blockchain hash
              </p>
            </div>

            <Button
              type="submit"
              disabled={verifying || !certificateHash}
              className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
            >
              {verifying ? 'Verifying...' : 'Verify Credential'}
            </Button>
          </form>
        </div>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card
            className={`glass-effect ${
              result.valid
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-red-500/50 bg-red-500/10'
            }`}
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">
                  {result.valid ? '✓' : '✗'}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {result.valid ? 'Credential Valid' : 'Credential Invalid'}
                </h2>
                <p
                  className={`mt-1 font-medium ${
                    result.valid ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  Confidence: {(result.confidenceScore * 100).toFixed(1)}%
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary/10 border border-border rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Certificate</div>
                    <div className="font-semibold text-foreground">{result.certificateTitle}</div>
                  </div>
                  <div className="bg-primary/10 border border-border rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Issuer</div>
                    <div className="font-semibold text-foreground">{result.issuer}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary/10 border border-border rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Issue Date</div>
                    <div className="font-semibold text-foreground">
                      {new Date(result.issueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-primary/10 border border-border rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Fraud Score</div>
                    <div
                      className={`font-semibold ${
                        result.fraudScore < 0.3
                          ? 'text-green-400'
                          : result.fraudScore < 0.7
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {(result.fraudScore * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {result.extractedSkills.length > 0 && (
                  <div className="bg-primary/10 border border-border rounded-lg p-4">
                    <div className="text-xs text-muted mb-2">Extracted Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {result.extractedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.warnings.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                    <div className="text-xs text-yellow-400 font-medium mb-2">Warnings</div>
                    <ul className="space-y-1 text-xs text-yellow-400">
                      {result.warnings.map((warning, i) => (
                        <li key={i} className="flex gap-2">
                          <span>•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.issuerVerified && (
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                    <p className="text-xs text-green-400 flex items-center gap-2">
                      <span>✓</span>
                      <span>Issuer verified and trusted</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="bg-primary/10 border border-border rounded-lg p-4">
            <div className="text-xs text-muted font-mono break-all">
              <span className="text-muted">Blockchain Hash: </span>
              {result.blockchainHash}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
