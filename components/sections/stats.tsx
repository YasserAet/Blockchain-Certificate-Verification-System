import { Users, Building2, FileCheck, TrendingUp, Shield, Globe } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
    description: 'Students and professionals',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Building2,
    value: '500+',
    label: 'Institutions',
    description: 'Universities and colleges',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: FileCheck,
    value: '1M+',
    label: 'Verified Credentials',
    description: 'Certificates on blockchain',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: TrendingUp,
    value: '99.8%',
    label: 'Detection Rate',
    description: 'AI fraud accuracy',
    color: 'from-orange-500 to-amber-500'
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Security',
    description: 'Blockchain-secured',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: Globe,
    value: '120+',
    label: 'Countries',
    description: 'Global coverage',
    color: 'from-indigo-500 to-violet-500'
  }
]

export function Stats() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent-rgb),0.05),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Thousands Worldwide
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join the global network of institutions and professionals who trust CertChain
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-background rounded-[9px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className="mb-1">
                  <div className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>

                {/* Hover gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
