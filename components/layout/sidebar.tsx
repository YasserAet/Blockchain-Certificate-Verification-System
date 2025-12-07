'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

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
          { href: '/student/dashboard', label: 'My Certificates', icon: '📜' },
          { href: '/student/upload', label: 'Upload', icon: '📤' },
          { href: '/student/portfolio', label: 'Portfolio', icon: '👤' },
        ]
      case 'institution':
        return [
          { href: '/institution/dashboard', label: 'Dashboard', icon: '📊' },
          { href: '/institution/issue', label: 'Issue Certificate', icon: '✏️' },
          { href: '/institution/alerts', label: 'Fraud Alerts', icon: '⚠️' },
        ]
      case 'employer':
        return [
          { href: '/employer/dashboard', label: 'Dashboard', icon: '🏢' },
          { href: '/employer/verify', label: 'Verify Credentials', icon: '✓' },
          { href: '/employer/matches', label: 'Skill Matches', icon: '🎯' },
        ]
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: '⚙️' },
          { href: '/admin/users', label: 'Users', icon: '👥' },
          { href: '/admin/alerts', label: 'Alerts', icon: '🔔' },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()
  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-64 bg-primary-lighter border-r border-border hidden md:flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-accent">CertChain</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-accent text-accent-foreground'
                : 'text-foreground hover:bg-primary/50'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
