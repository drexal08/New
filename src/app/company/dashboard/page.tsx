
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useUser, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, orderBy, doc, where } from "firebase/firestore";
import { Bus, Users, TrendingUp, Calendar, Plus, Edit, Trash2, MapPin, Clock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function CompanyDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => user ? doc(firestore, "user_profiles", user.uid) : null, [firestore, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const ADMIN_EMAIL = 'byiringirinnocent8@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  // Standardized role authorization
  const isAuthorized = profile?.role === 'OPERATOR' || profile?.role === 'COMPANY' || isAdmin;

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) {
        router.push("/login");
      } else if (!isAuthorized) {
        toast({
          variant: "destructive",
          title: "Access Restricted",
          description: "This portal is reserved for fleet operators and companies.",
        });
        router.push("/");
      }
    }
  }, [user, isUserLoading, isProfileLoading, isAuthorized, router, toast]);

  const companyId = profile?.companyId || user?.uid;

  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || !profile) return null;
    
    if (isAdmin) {
      return query(collection(firestore, "trips"), orderBy("departureTime", "desc"));
    }

    return query(
      collection(firestore, "trips"),
      where("transportCompanyId", "==", companyId),
      orderBy("departureTime", "desc")
    );
  }, [firestore, profile, isAdmin, companyId]);

  const { data: trips, isLoading: isTripsLoading } = useCollection(tripsQuery);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Fleet Command <ShieldCheck className="h-6 w-6 text-accent" />
            </h1>
            <p className="text-muted-foreground font-medium">Managing operations for {profile?.name || profile?.firstName || "Your Fleet"}</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-xl h-12 px-6 font-bold border-gray-200">
               <Link href="/company/buses">View Fleet</Link>
            </Button>
            <Button asChild className="rounded-xl h-12 px-6 bg-accent hover:bg-accent/90 font-bold">
              <Link href="/company/trips/new">
                <Plus className="h-5 w-5 mr-2" /> Publish Trip
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Est. Revenue", value: "850k RWF", icon: TrendingUp, color: "bg-primary" },
            { label: "Bookings", value: "154", icon: Users, color: "bg-accent" },
            { label: "Active Buses", value: "8", icon: Bus, color: "bg-orange-500" },
            { label: "Schedules", value: trips?.length || 0, icon: Calendar, color: "bg-teal-600" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color.split('-')[1] || 'primary'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Active manifests</h2>
            <Link href="/search" className="text-primary font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 hover:underline">
              Marketplace View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isTripsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin opacity-20" />
            </div>
          ) : trips && trips.length > 0 ? (
            <div className="grid gap-4">
              {trips.map((trip) => (
                <Card key={trip.id} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="bg-gray-100 p-3 rounded-xl">
                          <Bus className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg tracking-tight">{trip.busName}</p>
                          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-primary/20 text-primary mt-0.5">{trip.registrationNumber || "N/A"}</Badge>
                        </div>
                      </div>

                      <div className="flex-grow grid md:grid-cols-3 gap-8">
                         <div className="flex items-center gap-3">
                           <MapPin className="h-4 w-4 text-primary" />
                           <div>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Route</p>
                             <p className="text-sm font-bold text-gray-800">{trip.originBusParkId} → {trip.destinationBusParkId}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <Clock className="h-4 w-4 text-primary" />
                           <div>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Departure</p>
                             <p className="text-sm font-bold text-gray-800">
                               {trip.departureTime ? format(new Date(trip.departureTime), "MMM dd, HH:mm") : "N/A"}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <Badge className="bg-accent text-white border-none font-bold text-[9px] uppercase tracking-widest px-3">{trip.status}</Badge>
                         </div>
                      </div>

                      <div className="flex gap-2">
                         <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-gray-100"><Edit className="h-4 w-4" /></Button>
                         <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-gray-100 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
               <Bus className="h-10 w-10 text-gray-200 mx-auto mb-6" />
               <p className="text-muted-foreground font-semibold mb-6">Your fleet has no published trips.</p>
               <Button asChild className="rounded-xl h-12 px-8">
                 <Link href="/company/trips/new">Post First Schedule</Link>
               </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
