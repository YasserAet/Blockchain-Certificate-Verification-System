'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, LogIn, UserPlus, Menu, X, Sparkles, CheckCircle2, Info, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navigation() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              CertChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              Features
            </Link>
            {/* Show Verify only for public users or employers */}
            {(!user || user.role === 'employer') && (
              <Link href="/verify" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                Verify
              </Link>
            )}
            <Link href="/about" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <Info className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              About
            </Link>
            <div className="w-px h-6 bg-border" />
            
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="group">
                  <Link href={`/${user.role}/dashboard`} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="group"
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="group">
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md shadow-accent/20 hover:shadow-accent/40 transition-all group" asChild>
                  <Link href="/register" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/40 animate-in slide-in-from-top-2">
            <Link 
              href="/#features" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              Features
            </Link>
            {/* Show Verify only for public users or employers */}
            {(!user || user.role === 'employer') && (
              <Link 
                href="/verify" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify
              </Link>
            )}
            <Link 
              href="/about" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <div className="border-t border-border/40 pt-3 space-y-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/${user.role}/dashboard`} className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.name}
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href="/register" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
