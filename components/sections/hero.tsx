import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Zap, Lock, CheckCircle, TrendingUp, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
              Verifiable Credentials,
              <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Powered by Blockchain
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Instant certificate verification with AI-powered fraud detection. 
              Secure, transparent, and tamper-proof credential management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 h-14 px-8 text-lg" asChild>
              <Link href="/register" className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Verifying
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-accent/10 h-14 px-8 text-lg" asChild>
              <Link href="#features" className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
            <div className="glass-effect p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Blockchain Security</h3>
              <p className="text-sm text-muted-foreground">Immutable records on Polygon network ensure credentials cannot be tampered with</p>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant Verification</h3>
              <p className="text-sm text-muted-foreground">Verify certificates in under 1 second with our AI-powered fraud detection</p>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">99.9% Accuracy</h3>
              <p className="text-sm text-muted-foreground">Advanced ML models trained on millions of certificates for maximum accuracy</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 border-t border-border/30 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">99.9%</div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Accuracy Rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">50K+</div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Verified Certificates</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">500+</div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Institutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
