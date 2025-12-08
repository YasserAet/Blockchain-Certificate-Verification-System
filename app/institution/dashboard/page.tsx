'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Award, AlertTriangle, FileCheck, Calendar, Download, Eye, Copy, Check } from 'lucide-react'

interface Certificate {
  id: number
  title: string
  recipient_email: string
  issue_date: string
  status: string
  fraud_score: number | null
  blockchain_tx_hash: string | null
}

export default function InstitutionDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [copiedHash, setCopiedHash] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    title: '',
    description: '',
    courseId: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'institution') {
      router.push(`/${parsedUser.role}/dashboard`)
      return
    }

    setUser(parsedUser)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const uploadFormData = new FormData()
      if (file) {
        uploadFormData.append('certificate', file)
      }
      uploadFormData.append('recipientEmail', formData.recipientEmail)
      uploadFormData.append('recipientName', formData.recipientName)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('courseId', formData.courseId)
      uploadFormData.append('issueDate', formData.issueDate)
      if (formData.expiryDate) {
        uploadFormData.append('expiryDate', formData.expiryDate)
      }

      const response = await fetch('/api/certificates/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      })

      const result = await response.json()

      if (response.ok) {
        alert('Certificate uploaded successfully!')
        // Reset form
        setFormData({
          recipientEmail: '',
          recipientName: '',
          title: '',
          description: '',
          courseId: '',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: '',
        })
        setFile(null)
        // Refresh certificates list
        fetchCertificates(token)
      } else {
        alert(`Upload failed: ${result.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload certificate')
    } finally {
      setUploading(false)
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

  if (!user) return null

  const fraudAlerts = certificates.filter(c => c.fraud_score && Number(c.fraud_score) > 70)

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
            <p className="text-muted-foreground">Issue and manage certificates</p>
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
                <p className="text-sm text-muted-foreground">Total Issued</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-green-500" />
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
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fraud Alerts</p>
                <p className="text-2xl font-bold">{fraudAlerts.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="p-6 border-border/40">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-accent" />
              Issue New Certificate
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  required
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="title">Certificate Title</Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Certificate description and achievements"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="courseId">Course ID</Label>
                <Input
                  id="courseId"
                  type="text"
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  placeholder="CS101"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certificate">Certificate File (PDF)</Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Issue Certificate'}
              </Button>
            </form>
          </Card>

          {/* Recent Certificates */}
          <Card className="p-6 border-border/40">
            <h2 className="text-2xl font-bold mb-6">Recently Issued</h2>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading certificates...</p>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No certificates issued yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {certificates.slice(0, 10).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 border border-border/40 rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          To: {cert.recipient_email}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cert.status === 'verified'
                            ? 'bg-green-500/10 text-green-500'
                            : cert.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {cert.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </div>
                      {cert.fraud_score !== null && cert.fraud_score !== undefined && (
                        <div
                          className={`flex items-center gap-1 ${
                            Number(cert.fraud_score) > 70 ? 'text-red-500' : 'text-green-500'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Fraud Score: {Number(cert.fraud_score).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Certificate ID:</span>
                        <code className="text-xs bg-accent/10 px-2 py-1 rounded">{cert.id}</code>
                        <button
                          onClick={() => copyToClipboard(cert.id.toString(), 'id', cert.id)}
                          className="p-1 hover:bg-accent/10 rounded transition-colors"
                          title="Copy Certificate ID"
                        >
                          {copiedId === cert.id ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {cert.blockchain_tx_hash && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Blockchain Hash:</span>
                          <code className="text-xs bg-accent/10 px-2 py-1 rounded font-mono truncate max-w-[200px]">
                            {cert.blockchain_tx_hash}
                          </code>
                          <button
                            onClick={() => copyToClipboard(cert.blockchain_tx_hash!, 'hash', cert.id)}
                            className="p-1 hover:bg-accent/10 rounded transition-colors"
                            title="Copy Blockchain Hash"
                          >
                            {copiedHash === cert.id ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Fraud Alerts Section */}
        {fraudAlerts.length > 0 && (
          <Card className="p-6 border-border/40 mt-8 border-red-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              Fraud Alerts
            </h2>

            <div className="space-y-4">
              {fraudAlerts.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 border border-red-500/20 rounded-lg bg-red-500/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Recipient: {cert.recipient_email}
                      </p>
                      <p className="text-sm text-red-500 mt-2">
                        ⚠ High fraud risk detected: {Number(cert.fraud_score).toFixed(1)}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
