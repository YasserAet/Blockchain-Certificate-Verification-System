import { Upload, Shield, CheckCircle, Award, ArrowRight, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Credentials',
    description: 'Institutions upload digital certificates and credentials to our secure platform with just a few clicks.',
    color: 'from-blue-500 to-cyan-500',
    delay: '0'
  },
  {
    icon: Shield,
    step: '02',
    title: 'Blockchain Storage',
    description: 'Credentials are encrypted and stored on the blockchain, creating an immutable and tamper-proof record.',
    color: 'from-purple-500 to-pink-500',
    delay: '100'
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'AI Verification',
    description: 'Our AI analyzes patterns and validates authenticity, detecting potential fraud with machine learning.',
    color: 'from-green-500 to-emerald-500',
    delay: '200'
  },
  {
    icon: Award,
    step: '04',
    title: 'Instant Access',
    description: 'Employers and verifiers can instantly access verified credentials with a simple search or QR code scan.',
    color: 'from-orange-500 to-amber-500',
    delay: '300'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-background to-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Secure,{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Seamless
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our four-step process makes credential verification effortless while maintaining the highest security standards
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/20 via-accent/50 to-accent/20 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              return (
                <div
                  key={index}
                  className="relative group"
                  style={{ animationDelay: `${stepItem.delay}ms` }}
                >
                  {/* Card */}
                  <div className="relative p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-2">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-background to-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent shadow-lg">
                      {stepItem.step}
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stepItem.color} p-0.5 group-hover:scale-110 transition-transform`}>
                        <div className="w-full h-full bg-background rounded-[15px] flex items-center justify-center">
                          <Icon className="w-8 h-8 text-accent" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                      {stepItem.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {stepItem.description}
                    </p>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                        <div className="w-8 h-8 rounded-full bg-background border border-accent/40 flex items-center justify-center group-hover:scale-125 transition-transform">
                          <ArrowRight className="w-4 h-4 text-accent" />
                        </div>
                      </div>
                    )}

                    {/* Hover gradient */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stepItem.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
