'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function IssueCertificate() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    studentEmail: '',
    studentName: '',
    certificateTitle: '',
    courseCode: '',
    issueDate: '',
    expiryDate: '',
    grade: '',
    description: '',
  })
  const [issuing, setIssuing] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    setIssuing(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/institution/issue-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to issue certificate')
      }

      router.push('/institution/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Issue Certificate</h1>
        <p className="text-muted mt-1">Create and issue a new certificate to a student</p>
      </div>

      <Card className="glass-effect">
        <div className="p-8">
          <form onSubmit={handleIssue} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Student Email
                </label>
                <Input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Student Name
                </label>
                <Input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Certificate Title
              </label>
              <Input
                type="text"
                name="certificateTitle"
                value={formData.certificateTitle}
                onChange={handleChange}
                placeholder="Bachelor of Science in Computer Science"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Course Code
                </label>
                <Input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="CS-101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Grade
                </label>
                <Input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="A+ / 95%"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Issue Date
                </label>
                <Input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Expiry Date (Optional)
                </label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about the certificate..."
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={issuing}
              className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
            >
              {issuing ? 'Issuing...' : 'Issue Certificate'}
            </Button>
          </form>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h3 className="font-semibold text-foreground mb-3">Blockchain Recording</h3>
        <p className="text-sm text-muted mb-2">
          Once issued, this certificate will be recorded on the blockchain with:
        </p>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Immutable certificate hash on Polygon network</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>AI fraud detection scores stored</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>Permanent audit trail for verification</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">•</span>
            <span>QR code generated for easy sharing</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
