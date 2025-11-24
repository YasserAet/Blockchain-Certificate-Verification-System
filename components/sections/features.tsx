import { Shield, Zap, Lock, Database, Brain, CheckCircle, Globe, TrendingUp, Users, FileCheck, AlertTriangle, Award, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Blockchain Security',
    description: 'Immutable credential storage on the blockchain ensures maximum security and tamper-proof verification.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Brain,
    title: 'AI Fraud Detection',
    description: 'Advanced machine learning algorithms detect fraudulent credentials with 99.8% accuracy.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Instant Verification',
    description: 'Verify credentials in seconds with our lightning-fast blockchain infrastructure.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Military-grade encryption protects sensitive credential data throughout the verification process.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Database,
    title: 'Decentralized Storage',
    description: 'Distributed data storage eliminates single points of failure and ensures 99.99% uptime.',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: Globe,
    title: 'Global Compatibility',
    description: 'Supports international credential standards and integrates with existing verification systems.',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    icon: FileCheck,
    title: 'Smart Contract Validation',
    description: 'Automated validation through smart contracts eliminates manual review and human error.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Tailored dashboards for institutions, employers, students, and administrators.',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    description: 'Comprehensive analytics and reporting for credential issuance and verification trends.',
    color: 'from-pink-500 to-fuchsia-500'
  },
  {
    icon: AlertTriangle,
    title: 'Fraud Alerts',
    description: 'Instant notifications when suspicious credential activity is detected.',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Award,
    title: 'Skill Endorsements',
    description: 'Blockchain-based skill validation and endorsements from verified professionals.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: CheckCircle,
    title: 'Compliance Ready',
    description: 'Meets GDPR, FERPA, and international data protection standards out of the box.',
    color: 'from-emerald-500 to-green-500'
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--accent-rgb),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Secure Credentials
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to make credential verification secure, fast, and reliable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
