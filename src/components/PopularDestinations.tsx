
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const destinations = [
  { id: "dest-kigali", name: "Kigali", price: "1,500", rating: "4.9", search: "Kigali" },
  { id: "dest-rubavu", name: "Rubavu", price: "3,200", rating: "4.8", search: "Rubavu" },
  { id: "dest-musanze", name: "Musanze", price: "2,500", rating: "4.7", search: "Musanze" },
];

export default function PopularDestinations() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Top Rwandan Destinations</h2>
            <p className="text-gray-500 font-medium text-lg">Travel comfortably to major hubs across the country</p>
          </div>
          <Link href="/search" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mb-2">
            Explore all routes <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((dest) => {
            const img = PlaceHolderImages.find(i => i.id === dest.id);
            return (
              <Link 
                key={dest.id} 
                href={`/search?to=${dest.search}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {img && (
                  <Image 
                    src={img.imageUrl} 
                    alt={dest.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint={img.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black mb-2">{dest.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold text-sm text-white">{dest.rating}</span>
                        </div>
                        <span className="text-white/60 text-sm font-medium">• 5k+ travelers monthly</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">From</p>
                      <p className="text-2xl font-black text-accent">{dest.price} RWF</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
