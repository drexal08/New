
"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Bus, Users, TrendingUp, Calendar, Plus, Edit, Trash2, MapPin, Clock, Loader2 } from "lucide-react";
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
      // In a real app, filter by companyId linked to user
      orderBy("departureTime", "desc")
    );
  }, [firestore]);

  const { data: trips, isLoading } = useCollection(tripsQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Operator Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage your schedules, bookings, and fleet performance.</p>
          </div>
          <Button asChild className="rounded-2xl h-14 px-8 bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20">
            <Link href="/company/trips/new">
              <Plus className="h-5 w-5 mr-2" /> Add New Trip
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue (MTW)</p>
                  <p className="text-2xl font-black text-gray-900">450k</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-4 rounded-2xl">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
                  <p className="text-2xl font-black text-gray-900">1.2k</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-4 rounded-2xl">
                  <Bus className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Fleet</p>
                  <p className="text-2xl font-black text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-teal-100 p-4 rounded-2xl">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upcoming Trips</p>
                  <p className="text-2xl font-black text-gray-900">{trips?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Table */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Active Schedules</h2>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : trips && trips.length > 0 ? (
            <div className="grid gap-4">
              {trips.map(trip => (
                <Card key={trip.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center p-6 gap-8">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="bg-gray-100 p-3 rounded-xl">
                          <Bus className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{trip.busName}</p>
                          <Badge variant="outline" className="text-[8px] uppercase tracking-tighter">ID: {trip.id.substring(0,8)}</Badge>
                        </div>
                      </div>

                      <div className="flex-grow grid md:grid-cols-3 gap-8">
                         <div className="flex items-center gap-3">
                           <MapPin className="h-4 w-4 text-primary" />
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Route</p>
                             <p className="text-sm font-bold text-gray-700">{trip.originBusParkId} → {trip.destinationBusParkId}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <Clock className="h-4 w-4 text-primary" />
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Departure</p>
                             <p className="text-sm font-bold text-gray-700">{format(new Date(trip.departureTime), "MMM dd, HH:mm")}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <Users className="h-4 w-4 text-accent" />
                           <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                             <Badge className="bg-teal-500">{trip.status}</Badge>
                           </div>
                         </div>
                      </div>

                      <div className="flex gap-2">
                         <Button variant="outline" size="icon" className="rounded-xl border-gray-200"><Edit className="h-4 w-4 text-gray-500" /></Button>
                         <Button variant="outline" size="icon" className="rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
               <Bus className="h-12 w-12 text-gray-200 mx-auto mb-4" />
               <p className="text-gray-400 font-bold">No active schedules found.</p>
               <Button asChild variant="link" className="text-primary font-black mt-2">
                 <Link href="/company/trips/new">Post your first trip</Link>
               </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
