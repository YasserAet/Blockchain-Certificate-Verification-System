import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Shield, Users, Target, Zap, Award, Globe, Heart, Rocket, TrendingUp, CheckCircle, Lock, Brain } from 'lucide-react'
import { Card } from '@/components/ui/card'

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    image: '/team/sarah.jpg',
    bio: 'Former blockchain architect at major tech companies with 15+ years experience.'
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    image: '/team/michael.jpg',
    bio: 'AI/ML expert specializing in fraud detection and pattern recognition.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product',
    image: '/team/emily.jpg',
    bio: 'Product leader with expertise in educational technology and verification systems.'
  },
  {
    name: 'David Kim',
    role: 'Lead Engineer',
    image: '/team/david.jpg',
    bio: 'Full-stack developer passionate about decentralized systems and security.'
  }
]

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize the security and privacy of your credentials above all else.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Heart,
    title: 'Trust & Transparency',
    description: 'Building trust through transparent blockchain technology and open communication.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'Constantly pushing boundaries with cutting-edge AI and blockchain solutions.',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Empowering institutions and individuals through collaborative technology.',
    color: 'from-green-500 to-emerald-500'
  }
]

const milestones = [
  { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize credential verification' },
  { year: '2021', title: 'First 100 Institutions', description: 'Reached our first major milestone of partner institutions' },
  { year: '2022', title: 'AI Integration', description: 'Launched advanced fraud detection using machine learning' },
  { year: '2023', title: '1M+ Credentials', description: 'Verified over one million credentials on the blockchain' },
  { year: '2024', title: 'Global Expansion', description: 'Expanded to 120+ countries worldwide' },
  { year: '2025', title: 'Industry Leader', description: 'Became the trusted standard for credential verification' }
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(var(--accent-rgb),0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              About Us
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Securing the Future of{' '}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Digital Credentials
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make credential verification secure, instant, and accessible to everyone through blockchain technology and artificial intelligence.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Users, value: '50K+', label: 'Active Users' },
              { icon: Globe, value: '120+', label: 'Countries' },
              { icon: CheckCircle, value: '1M+', label: 'Verified Credentials' },
              { icon: TrendingUp, value: '99.8%', label: 'Accuracy Rate' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="p-6 text-center border-border/40 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10">
                  <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Empowering Trust in the Digital Age
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                In a world where credentials and qualifications are increasingly digital, we believe everyone deserves a secure, transparent, and efficient way to verify their achievements.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our blockchain-powered platform combines cutting-edge security with AI-driven fraud detection to create an ecosystem of trust that benefits students, institutions, and employers alike.
              </p>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'Secure', color: 'from-blue-500 to-cyan-500' },
                  { icon: Zap, title: 'Fast', color: 'from-yellow-500 to-orange-500' },
                  { icon: Lock, title: 'Private', color: 'from-green-500 to-emerald-500' },
                  { icon: Brain, title: 'Smart', color: 'from-purple-500 to-pink-500' }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Card key={index} className="p-6 border-border/40 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10 group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-0.5 mb-4 group-hover:scale-110 transition-transform`}>
                        <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="p-6 border-border/40 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} p-0.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From startup to industry leader
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-accent/20 via-accent/50 to-accent/20 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="p-6 inline-block border-border/40 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10">
                      <div className="text-accent font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  <div className="hidden md:block w-4 h-4 rounded-full bg-accent border-4 border-background shadow-lg shadow-accent/20 relative z-10" />
                  
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people behind CertChain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 border-border/40 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10 group text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-12 h-12 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <div className="text-accent text-sm font-medium mb-3">{member.role}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent/10 to-primary/10 border-y border-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Join Us on Our Mission</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Be part of the future of credential verification. Start securing your credentials today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all group"
            >
              Get Started Free
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-border hover:border-accent/40 font-medium hover:bg-accent/5 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
