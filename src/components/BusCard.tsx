"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Users, MapPin, Shield, Zap, Info, Bus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function BusCard({ trip }: { trip: any }) {
  const departure = trip.departureTime ? new Date(trip.departureTime) : new Date();
  const arrival = trip.arrivalTime ? new Date(trip.arrivalTime) : new Date();
  
  const bookedCount = trip.bookedSeatNumbers?.length || 0;
  const totalCapacity = trip.capacity || 40;
  const availableSeats = totalCapacity - bookedCount;
  const isFull = availableSeats <= 0;

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl group animate-in fade-in slide-in-from-bottom-4">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-8 flex-grow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">{trip.busName || "Standard Bus"}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-lg px-3 py-0.5 font-bold text-[10px] uppercase tracking-widest border-none">
                      {trip.status || "Scheduled"}
                    </Badge>
                    {trip.busType && (
                      <Badge className="bg-accent/10 text-accent hover:bg-accent/20 rounded-lg px-3 py-0.5 font-bold text-[10px] uppercase tracking-widest border-none">
                        {trip.busType}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold">4.8</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    <Bus className="h-3.5 w-3.5" />
                    {trip.registrationNumber || "Plate Pending"}
                  </div>
                  <div className="flex items-center gap-1.5 text-accent text-[9px] font-bold uppercase tracking-[0.2em] opacity-70">
                    <Shield className="h-3.5 w-3.5" />
                    Verified
                  </div>
                </div>
              </div>

              <div className="md:text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fare From</p>
                <div className="text-3xl font-bold text-primary tracking-tight">
                  {trip.price?.toLocaleString() || "0"} <span className="text-xs font-medium ml-0.5">RWF</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 transition-all group-hover:bg-white group-hover:border-primary/20">
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{format(departure, "HH:mm")}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Departure</p>
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-[9px] font-bold text-primary mb-2 uppercase tracking-widest">Direct</p>
                <div className="relative w-full h-[2px] bg-gray-200 rounded-full">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-primary" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                     <Zap className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>

              <div className="md:text-right space-y-0.5">
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{format(arrival, "HH:mm")}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Arrival</p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
               <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100 font-bold text-[9px] text-gray-500 uppercase tracking-widest"><MapPin className="h-3.5 w-3.5 text-primary" /> {trip.originBusParkId}</span>
               {isFull ? (
                 <span className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 font-bold text-[9px] text-red-600 uppercase tracking-widest"><AlertCircle className="h-3.5 w-3.5" /> Fully Booked</span>
               ) : (
                 <span className="flex items-center gap-1.5 bg-accent/5 px-3 py-1.5 rounded-xl border border-accent/10 font-bold text-[9px] text-accent uppercase tracking-widest">
                   <Users className="h-3.5 w-3.5" /> {availableSeats} Seats Left
                 </span>
               )}
            </div>
          </div>

          <div className="bg-gray-50 p-8 flex flex-col items-center justify-center md:border-l border-gray-100 md:min-w-[220px] transition-colors group-hover:bg-primary/5">
            <Button asChild disabled={isFull} className={cn("w-full h-12 text-white font-bold rounded-xl transition-all active:scale-95 mb-3", isFull ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20")}>
              <Link href={isFull ? "#" : `/booking/${trip.id}`}>{isFull ? "Sold Out" : "Book Seat"}</Link>
            </Button>
            <div className="flex items-center gap-2 opacity-60">
              <Info className="h-3.5 w-3.5 text-gray-400" />
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">E-Ticket Incl.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
