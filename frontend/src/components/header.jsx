"use client"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">💬</span>
            </div>
            <span className="font-bold text-xl text-foreground">ChatFlow</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition">
              Features
            </a>
            <a href="#testimonials" className="text-foreground/70 hover:text-foreground transition">
              Testimonials
            </a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex px-4 py-2 text-foreground/70 hover:text-foreground transition">
              Log in
            </button>
            <button className="px-6 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-lg font-medium transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
