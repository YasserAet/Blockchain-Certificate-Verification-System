'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-accent">
          Credential Chain
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-foreground/80 hover:text-foreground transition-smooth">
            Features
          </Link>
          <Link href="#verify" className="text-foreground/80 hover:text-foreground transition-smooth">
            Verify
          </Link>
          <Link href="#about" className="text-foreground/80 hover:text-foreground transition-smooth">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
