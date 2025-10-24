import { MessageSquare, Lock, Zap, Users, FileText, Globe } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Instant Messaging",
    description: "Send and receive messages in real-time with zero latency",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Your conversations are always private and secure",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with sub-100ms message delivery",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Create channels and organize conversations by topic",
  },
  {
    icon: FileText,
    title: "File Sharing",
    description: "Share documents, images, and files instantly",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Connect with teams across the world seamlessly",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything you need to communicate
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-pretty">
            Powerful features designed to keep your team connected and productive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
