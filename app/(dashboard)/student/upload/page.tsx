'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function UploadCertificate() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState({
    certificateTitle: '',
    issuer: '',
    issueDate: '',
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({
      ...metadata,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError('')

    if (!file) {
      setError('Please select a file')
      setUploading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('metadata', JSON.stringify(metadata))

      const token = localStorage.getItem('token')
      const response = await fetch('/api/certificates/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      router.push('/student/dashboard')
    } catch (err) {
      setError('Failed to upload certificate. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Certificate</h1>
        <p className="text-muted mt-1">Add your educational or professional credentials</p>
      </div>

      <Card className="glass-effect">
        <div className="p-8">
          <form onSubmit={handleUpload} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-4">
                Certificate Image (PDF, JPG, or PNG)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  {file ? (
                    <div>
                      <p className="text-foreground font-medium">{file.name}</p>
                      <p className="text-xs text-muted mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-foreground font-medium">Drag and drop your certificate</p>
                      <p className="text-sm text-muted mt-1">or click to browse</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Certificate Title
              </label>
              <Input
                type="text"
                name="certificateTitle"
                value={metadata.certificateTitle}
                onChange={handleMetadataChange}
                placeholder="e.g., Bachelor of Science in Computer Science"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Issuing Institution
              </label>
              <Input
                type="text"
                name="issuer"
                value={metadata.issuer}
                onChange={handleMetadataChange}
                placeholder="e.g., MIT, Google Cloud Academy"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Issue Date
              </label>
              <Input
                type="date"
                name="issueDate"
                value={metadata.issueDate}
                onChange={handleMetadataChange}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
            >
              {uploading ? 'Uploading...' : 'Upload Certificate'}
            </Button>
          </form>
        </div>
      </Card>

      <Card className="glass-effect p-6">
        <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="text-accent font-bold">1.</span>
            <span>Our AI will scan and extract information from your certificate</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">2.</span>
            <span>Fraud detection will verify authenticity</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">3.</span>
            <span>Skills will be extracted and added to your portfolio</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent font-bold">4.</span>
            <span>Once verified, it will be recorded on the blockchain</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
