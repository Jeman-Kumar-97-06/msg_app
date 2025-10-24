import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Emma Thompson",
    role: "Product Manager at TechCorp",
    content: "ChatFlow has transformed how our team communicates. The speed and reliability are unmatched.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "CEO at StartupHub",
    content: "We switched from our old platform and never looked back. Best decision we made this year.",
    rating: 5,
  },
  {
    name: "Lisa Chen",
    role: "Team Lead at DesignStudio",
    content: "The interface is intuitive and the features are exactly what we needed. Highly recommended!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Loved by teams worldwide</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            See what our customers have to say about ChatFlow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-foreground/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
