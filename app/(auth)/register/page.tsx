'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/layout/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)

      const redirects: Record<string, string> = {
        student: '/student/dashboard',
        institution: '/institution/dashboard',
        employer: '/employer/dashboard',
        admin: '/admin/dashboard',
      }

      router.push(redirects[formData.role] || '/student/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md glass-effect">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center text-foreground mb-6">
              Create Account
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="student">Student</option>
                  <option value="institution">Institution</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-muted text-sm mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:text-accent-light">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
