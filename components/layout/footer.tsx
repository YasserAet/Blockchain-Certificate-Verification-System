import Link from 'next/link'
import { Shield, Mail, MapPin, Phone, Sparkles, Lock, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                CertChain
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              Blockchain-powered credential verification with AI-driven fraud detection. 
              Secure, transparent, and trusted by institutions worldwide.
            </p>
           
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Features
                </a>
              </li>
              <li>
                <a href="#security" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <Lock className="w-3 h-3 opacity-50" />
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <Mail className="w-3 h-3 opacity-50" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#privacy" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cookie Policy
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-border/40 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CertChain. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-accent" />
              Secured by Blockchain
            </span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-accent" />
              AI-Powered Detection
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
