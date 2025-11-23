import { Hero } from '@/components/sections/hero'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Footer />
    </main>
  )
}
