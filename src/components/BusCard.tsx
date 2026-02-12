
"use client";

import { BusRoute } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, MapPin, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function BusCard({ route }: { route: BusRoute }) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-3xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-8 flex-grow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{route.busName}</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-lg px-3 py-1 font-bold">
                    {route.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-black">{route.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-widest">
                    <Shield className="h-3.5 w-3.5" />
                    Verified Operator
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Starting From</p>
                   <div className="text-4xl font-black text-primary">
                     ${route.price}
                   </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="text-left">
                <p className="text-2xl font-black text-gray-900">{route.departureTime}</p>
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">{route.origin}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-xs font-black text-primary mb-2 uppercase tracking-widest">{route.duration}</p>
                <div className="relative w-full h-[3px] bg-gray-200 rounded-full">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-4 border-gray-300 shadow-sm" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-4 border-primary shadow-sm" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                     <Zap className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-tighter">Direct Trip</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{route.arrivalTime}</p>
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">{route.destination}</p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-gray-400">
               <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Real-time tracking</span>
               <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Sanitized seats</span>
               <span className="flex items-center gap-1.5 text-teal-600"><Users className="h-4 w-4" /> {route.availableSeats} seats left</span>
            </div>
          </div>

          <div className="bg-gray-50/50 p-8 flex flex-col items-center justify-center md:border-l border-gray-200 md:min-w-[220px]">
            <Button asChild className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-accent/20 hover:shadow-none transition-all active:scale-95">
              <Link href={`/booking/${route.id}`}>Select Seat</Link>
            </Button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">No extra fees</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
