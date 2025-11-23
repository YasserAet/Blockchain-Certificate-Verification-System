import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary via-primary-lighter to-primary overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Verifiable Credentials,
              <span className="block text-accent">Powered by Blockchain</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Instant certificate verification, AI-powered fraud detection, and transparent credential management on the blockchain. No more fake credentials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="bg-accent hover:bg-accent-light text-primary" asChild>
              <Link href="/register">Start Verifying</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-border/50">
            <div>
              <div className="text-3xl font-bold text-accent">99.9%</div>
              <p className="text-sm text-foreground/60">Accuracy Rate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">50K+</div>
              <p className="text-sm text-foreground/60">Verified Certs</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">&lt;1s</div>
              <p className="text-sm text-foreground/60">Verification Time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
