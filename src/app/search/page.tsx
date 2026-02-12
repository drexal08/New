
"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import BusSearchForm from "@/components/BusSearchForm";
import BusCard from "@/components/BusCard";
import { MOCK_ROUTES } from "@/lib/mock-data";
import { Filter, SlidersHorizontal, ArrowRight, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const filteredRoutes = MOCK_ROUTES.filter(r => {
    if (from && !r.origin.toLowerCase().includes(from.toLowerCase())) return false;
    if (to && !r.destination.toLowerCase().includes(to.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-primary pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mb-6">
             <h1 className="text-white text-3xl font-black flex items-center gap-3">
               Select Your Ride
               <span className="text-sm font-medium text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                 {filteredRoutes.length} options available
               </span>
             </h1>
           </div>
           <BusSearchForm className="shadow-2xl border-none" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-lg">
                  <SlidersHorizontal className="h-5 w-5 text-primary" /> Filters
                </h3>
                <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Clear</button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-black mb-5 uppercase tracking-[0.2em] text-gray-400">Bus Type</h4>
                  <div className="space-y-4">
                    {['Luxury', 'AC', 'Non-AC', 'Sleeper'].map(type => (
                      <div key={type} className="flex items-center group cursor-pointer">
                        <Checkbox id={type} className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        <Label htmlFor={type} className="ml-3 text-sm font-bold text-gray-600 group-hover:text-primary transition-colors cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div>
                  <h4 className="text-xs font-black mb-5 uppercase tracking-[0.2em] text-gray-400">Departure Time</h4>
                  <div className="space-y-4">
                    {[
                      { id: 'morning', label: 'Morning (6 AM - 12 PM)' },
                      { id: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
                      { id: 'evening', label: 'Evening (6 PM - 12 AM)' }
                    ].map(time => (
                      <div key={time.id} className="flex items-center group cursor-pointer">
                        <Checkbox id={time.id} className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        <Label htmlFor={time.id} className="ml-3 text-sm font-bold text-gray-600 group-hover:text-primary transition-colors cursor-pointer">{time.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                   <div className="flex gap-2 text-primary">
                     <Info className="h-4 w-4 shrink-0 mt-0.5" />
                     <p className="text-[10px] font-bold leading-relaxed uppercase">Prices include taxes and free traveler insurance.</p>
                   </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-2xl">
                   <ArrowRight className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    {from || "Nearby"} to {to || "Destination"}
                  </h2>
                  <p className="text-gray-500 font-bold text-sm">Showing routes for Oct 24, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sort:</span>
                <select className="bg-transparent border-none text-sm font-black text-primary focus:ring-0 cursor-pointer p-0 pr-6">
                   <option>Cheapest First</option>
                   <option>Earliest Departure</option>
                   <option>Customer Rating</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map(route => (
                  <BusCard key={route.id} route={route} />
                ))
              ) : (
                <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center">
                  <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                     <AlertCircle className="h-12 w-12 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No Buses Found</h3>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">We couldn't find any buses matching your criteria. Try adjusting your filters or searching for a different date.</p>
                  <Button variant="outline" className="rounded-full px-10 border-primary text-primary font-bold" onClick={() => window.location.reload()}>
                    Reset Search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
