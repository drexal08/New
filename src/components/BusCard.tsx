"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, MapPin, Shield, Zap, Info, Bus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function BusCard({ trip }: { trip: any }) {
  const departure = trip.departureTime ? new Date(trip.departureTime) : new Date();
  const arrival = trip.arrivalTime ? new Date(trip.arrivalTime) : new Date();

  return (
    <Card className="overflow-hidden border-none shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white rounded-[2.5rem] group animate-in fade-in slide-in-from-bottom-4">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-10 flex-grow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">{trip.busName || "Standard Bus"}</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-xl px-4 py-1 font-black text-[10px] uppercase tracking-widest">
                    {trip.status || "Scheduled"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-black">4.8</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                    <Bus className="h-4 w-4" />
                    {trip.registrationNumber || "Plate Pending"}
                  </div>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                    <Shield className="h-4 w-4" />
                    Verified Operator
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Starting From</p>
                <div className="text-4xl font-black text-primary tracking-tighter">
                  {trip.price?.toLocaleString() || "0"} <span className="text-sm font-bold ml-1">RWF</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center bg-gray-50/80 p-8 rounded-[2rem] border border-gray-100 transition-all group-hover:bg-white group-hover:border-primary/10">
              <div className="text-left space-y-1">
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{format(departure, "HH:mm")}</p>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Departure</p>
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-black text-primary mb-3 uppercase tracking-[0.3em]">Direct Route</p>
                <div className="relative w-full h-[3px] bg-gray-200 rounded-full overflow-visible">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-gray-300 shadow-sm" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-primary shadow-sm" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 transition-transform group-hover:scale-125 duration-500">
                     <Zap className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{format(arrival, "HH:mm")}</p>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Estimated Arrival</p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
               <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50 font-black text-[10px] text-gray-500 uppercase tracking-widest"><MapPin className="h-4 w-4 text-primary" /> {trip.originBusParkId}</span>
               <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50 font-black text-[10px] text-gray-500 uppercase tracking-widest"><Clock className="h-4 w-4 text-primary" /> Real-time tracking</span>
               <span className="flex items-center gap-2 text-accent bg-accent/5 px-4 py-2 rounded-2xl border border-accent/10 font-black text-[10px] uppercase tracking-widest"><Users className="h-4 w-4" /> Limited Seats</span>
            </div>
          </div>

          <div className="bg-gray-50/50 p-10 flex flex-col items-center justify-center md:border-l border-gray-100 md:min-w-[250px] transition-colors group-hover:bg-primary/5">
            <Button asChild className="w-full h-16 bg-accent hover:bg-accent/90 text-white font-black text-xl rounded-[1.5rem] shadow-2xl shadow-accent/20 hover:shadow-none transition-all active:scale-95 mb-4">
              <Link href={`/booking/${trip.id}`}>Select Seat</Link>
            </Button>
            <div className="flex items-center gap-2 opacity-50">
              <Info className="h-4 w-4 text-gray-400" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">E-Ticket & QR Incl.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
