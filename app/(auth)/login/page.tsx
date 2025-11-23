'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/layout/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      // Store token and redirect based on role
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      
      const redirects: Record<string, string> = {
        student: '/student/dashboard',
        institution: '/institution/dashboard',
        employer: '/employer/dashboard',
        admin: '/admin/dashboard',
      }

      router.push(redirects[data.user.role] || '/student/dashboard')
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
              Sign In
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-muted text-sm mt-4">
              Don't have an account?{' '}
              <Link href="/register" className="text-accent hover:text-accent-light">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
