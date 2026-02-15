
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Star, MapPin } from "lucide-react";
import Link from "next/link";

const destinations = [
  { id: "dest-kigali", name: "Kigali", price: "1,500", rating: "4.9", search: "Kigali", region: "Capital" },
  { id: "dest-rubavu", name: "Rubavu", price: "3,200", rating: "4.8", search: "Rubavu", region: "West" },
  { id: "dest-musanze", name: "Musanze", price: "2,500", rating: "4.7", search: "Musanze", region: "North" },
  { id: "dest-huye", name: "Huye", price: "2,800", rating: "4.6", search: "Huye", region: "South" },
  { id: "dest-rwamagana", name: "Rwamagana", price: "1,800", rating: "4.5", search: "Rwamagana", region: "East" },
  { id: "dest-rusizi", name: "Rusizi", price: "5,000", rating: "4.8", search: "Rusizi", region: "South West" },
];

export default function PopularDestinations() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Explore Rwanda</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Top Destinations</h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl">
              From the high volcanoes in the North to the serene shores of Lake Kivu in the West, book your trip to any part of the country.
            </p>
          </div>
          <Link href="/search" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mb-2 group">
            Explore all routes <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => {
            const img = PlaceHolderImages.find(i => i.id === dest.id);
            return (
              <Link 
                key={dest.id} 
                href={`/search?to=${dest.search}`}
                className="group relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute top-6 right-6">
                   <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{dest.region}</span>
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black mb-2">{dest.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-bold text-sm text-white">{dest.rating}</span>
                        </div>
                        <span className="text-white/60 text-sm font-medium">• Daily trips</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Fare From</p>
                      <p className="text-2xl font-black text-accent">{dest.price} <span className="text-xs">RWF</span></p>
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
