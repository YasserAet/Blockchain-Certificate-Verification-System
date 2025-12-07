'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setRole(localStorage.getItem('role'))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/login')
  }

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { href: '/student/dashboard', label: 'Certificates' },
          { href: '/student/upload', label: 'Upload' },
        ]
      case 'institution':
        return [
          { href: '/institution/dashboard', label: 'Dashboard' },
          { href: '/institution/issue', label: 'Issue' },
        ]
      case 'employer':
        return [
          { href: '/employer/dashboard', label: 'Dashboard' },
          { href: '/employer/verify', label: 'Verify' },
        ]
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/users', label: 'Users' },
        ]
      default:
        return []
    }
  }

  return (
    <header className="bg-primary-lighter border-b border-border md:hidden sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-bold text-accent">CertChain</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-foreground"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border p-4 space-y-2">
          {getNavItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-foreground hover:bg-primary/50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg mt-2"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  )
}
