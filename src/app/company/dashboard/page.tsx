"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Bus, Users, TrendingUp, Calendar, Plus, Edit, Trash2, MapPin, Clock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function CompanyDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const tripsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "trips"),
      orderBy("departureTime", "desc")
    );
  }, [firestore]);

  const { data: trips, isLoading } = useCollection(tripsQuery);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Operator Dashboard</h1>
            <p className="text-gray-500 font-bold text-lg">Manage your schedules, fleet, and performance across Rwanda.</p>
          </div>
          <Button asChild className="rounded-[1.25rem] h-16 px-10 bg-accent hover:bg-accent/90 shadow-2xl shadow-accent/20 font-black text-xl transition-all active:scale-95">
            <Link href="/company/trips/new">
              <Plus className="h-6 w-6 mr-3" /> Add New Trip
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Revenue (MTW)", value: "450k", icon: TrendingUp, color: "bg-primary" },
            { label: "Total Bookings", value: "1.2k", icon: Users, color: "bg-accent" },
            { label: "Active Fleet", value: "12", icon: Bus, color: "bg-orange-500" },
            { label: "Upcoming Trips", value: trips?.length || 0, icon: Calendar, color: "bg-teal-600" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white hover:shadow-2xl transition-all duration-500 animate-in fade-in zoom-in" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className={`${stat.color} bg-opacity-10 p-5 rounded-[1.5rem]`}>
                    <stat.icon className={`h-8 w-8 text-${stat.color.split('-')[1] || 'primary'}`} style={{ color: !stat.color.includes('-') ? 'var(--primary)' : '' }} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trips Table */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Schedules</h2>
            <Link href="/search" className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              View All Public Routes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-16 w-16 text-primary animate-spin opacity-20" />
            </div>
          ) : trips && trips.length > 0 ? (
            <div className="grid gap-6">
              {trips.map((trip, idx) => (
                <Card key={trip.id} className="border-none shadow-xl shadow-gray-200/30 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center p-8 gap-10">
                      <div className="flex items-center gap-6 min-w-[280px]">
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <Bus className="h-8 w-8 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-xl tracking-tight">{trip.busName}</p>
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary mt-1">PLATE: {trip.registrationNumber || "PENDING"}</Badge>
                        </div>
                      </div>

                      <div className="flex-grow grid md:grid-cols-3 gap-10">
                         <div className="flex items-center gap-5">
                           <div className="bg-primary/5 p-3 rounded-xl">
                             <MapPin className="h-5 w-5 text-primary" />
                           </div>
                           <div>
                             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Route</p>
                             <p className="text-base font-black text-gray-800">{trip.originBusParkId} <span className="text-primary mx-1">→</span> {trip.destinationBusParkId}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-5">
                           <div className="bg-primary/5 p-3 rounded-xl">
                             <Clock className="h-5 w-5 text-primary" />
                           </div>
                           <div>
                             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Departure</p>
                             <p className="text-base font-black text-gray-800">{format(new Date(trip.departureTime), "MMM dd, HH:mm")}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-5">
                           <div className="bg-accent/5 p-3 rounded-xl">
                             <Users className="h-5 w-5 text-accent" />
                           </div>
                           <div>
                             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Live Status</p>
                             <Badge className="bg-accent text-white border-none font-black text-[10px] uppercase tracking-widest px-3">{trip.status}</Badge>
                           </div>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-gray-100 hover:bg-gray-50 transition-all active:scale-90"><Edit className="h-6 w-6 text-gray-400" /></Button>
                         <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-90"><Trash2 className="h-6 w-6" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] p-32 text-center border-2 border-dashed border-gray-100 animate-in zoom-in duration-700">
               <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Bus className="h-12 w-12 text-gray-200" />
               </div>
               <p className="text-gray-400 font-black text-2xl tracking-tight mb-4">No active schedules found.</p>
               <Button asChild variant="link" className="text-primary font-black text-lg h-auto p-0 hover:underline">
                 <Link href="/company/trips/new">Post your first trip to get started</Link>
               </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
