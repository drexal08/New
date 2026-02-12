
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "Regular Traveler",
    text: "EZ Bus has completely changed how I commute between NY and Philly. The booking is seamless and the buses are always on time.",
    avatar: "user-avatar-1",
    stars: 5
  },
  {
    name: "Mark Thompson",
    role: "Business Consultant",
    text: "The luxury sleeper buses are a game changer for business trips. I can sleep comfortably and arrive fresh for my meetings.",
    avatar: "user-avatar-2",
    stars: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">What our travelers say</h2>
          <p className="text-gray-500 font-medium text-lg">Join thousands of happy commuters across the country</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <Quote className="h-96 w-96 text-primary fill-current" />
          </div>
          
          {reviews.map((review, i) => {
            const avatar = PlaceHolderImages.find(img => img.id === review.avatar);
            return (
              <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 relative hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 font-medium leading-relaxed mb-8 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  {avatar && (
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-4 border-white shadow-sm">
                      <Image 
                        src={avatar.imageUrl} 
                        alt={review.name} 
                        fill 
                        className="object-cover"
                        data-ai-hint={avatar.imageHint}
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-black text-gray-900">{review.name}</h4>
                    <p className="text-sm text-primary font-bold uppercase tracking-wider">{review.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
