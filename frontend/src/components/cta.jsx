export function CTA() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
          Ready to transform your team communication?
        </h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto text-pretty">
          Join thousands of teams already using ChatFlow. Start your free trial today—no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-primary-foreground text-primary hover:bg-muted rounded-lg font-medium transition">
            Start Free Trial
          </button>
          <button className="px-8 py-3 border border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent rounded-lg font-medium transition">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  )
}