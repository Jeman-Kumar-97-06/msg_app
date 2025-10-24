export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-block bg-muted px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-muted-foreground">✨ New: Real-time collaboration</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight text-balance">
                Connect instantly with your team
              </h1>
              <p className="text-xl text-foreground/70 leading-relaxed text-pretty">
                ChatFlow brings your team together with lightning-fast messaging, file sharing, and seamless
                integrations. Stay connected, stay productive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-primary hover:bg-accent text-primary-foreground rounded-lg font-medium text-base transition">
                Start Free Trial
              </button>
              <button className="px-8 py-3 bg-transparent border border-border text-foreground hover:bg-muted rounded-lg font-medium text-base transition">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-foreground/60">Active Teams</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <p className="text-sm text-foreground/60">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-foreground/60">Support</p>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative h-96 sm:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">Sarah Chen</p>
                    <p className="text-xs text-foreground/50">2 minutes ago</p>
                  </div>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-foreground text-sm">Great work on the project! The new design looks amazing 🎉</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">Alex Rivera</p>
                    <p className="text-xs text-foreground/50">Just now</p>
                  </div>
                </div>
                <div className="bg-accent/10 rounded-lg p-4">
                  <p className="text-foreground text-sm">Thanks! Ready to ship it tomorrow 🚀</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
