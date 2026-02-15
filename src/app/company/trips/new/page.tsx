"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useUser, addDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { BUS_PARKS, TRANSPORT_COMPANIES } from "@/lib/mock-data";
import { ChevronLeft, Loader2, Save, Bus as BusIcon } from "lucide-react";
import Link from "next/link";

export default function NewTripPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const profileRef = useMemoFirebase(() => user ? doc(firestore, "user_profiles", user.uid) : null, [firestore, user]);
  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const ADMIN_EMAIL = 'byiringirinnocent8@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;
  const isOperator = profile?.role === 'company' || isAdmin;

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user || !isOperator) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only transport operators and administrators can post new trips.",
        });
        router.push("/");
      }
    }
  }, [user, isUserLoading, isProfileLoading, isOperator, router, toast]);

  const [formData, setFormData] = useState({
    busName: "Volcano Express",
    registrationNumber: "",
    busType: "Luxury",
    capacity: "40",
    originBusParkId: "Nyabugogo Bus Terminal",
    destinationBusParkId: "Rubavu Main Park",
    departureTime: "",
    arrivalTime: "",
    price: "3500",
    status: "Scheduled",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isOperator) return;

    setIsSaving(true);
    try {
      const companyId = formData.busName.toLowerCase().replace(/\s+/g, '-');
      
      const tripData = {
        ...formData,
        price: parseInt(formData.price),
        capacity: parseInt(formData.capacity),
        transportCompanyId: companyId,
        routeId: `${formData.originBusParkId}-${formData.destinationBusParkId}`,
        busId: `bus-${companyId}-${Date.now()}`,
        bookedSeatNumbers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDocumentNonBlocking(collection(firestore, "trips"), tripData);
      
      toast({ title: "Trip Posted!", description: "Your schedule is now live and searchable." });
      router.push("/company/dashboard");
    } catch (error: any) {
      // Errors are handled by the global listener, but we reset saving state
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/company/dashboard" className="inline-flex items-center text-primary font-bold mb-8 hover:gap-2 transition-all text-xs uppercase tracking-widest">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-white p-8 md:p-10">
            <div className="flex items-center gap-4 mb-2">
              <BusIcon className="h-8 w-8 text-white/80" />
              <CardTitle className="text-3xl font-bold">Post New Schedule</CardTitle>
            </div>
            <p className="text-white/70 font-medium">Configure vehicle details, route terminals, and passenger fare.</p>
          </CardHeader>
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Transport Provider</Label>
                  <Select onValueChange={(val) => setFormData({...formData, busName: val})} defaultValue={formData.busName}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-semibold">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      {TRANSPORT_COMPANIES.map(comp => (
                        <SelectItem key={comp} value={comp} className="rounded-lg">{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Plate Number</Label>
                  <Input 
                    placeholder="e.g. RAB 001 X"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({...formData, registrationNumber: e.target.value.toUpperCase()})}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold uppercase"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Bus Class / Type</Label>
                  <Select onValueChange={(val) => setFormData({...formData, busType: val})} defaultValue={formData.busType}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-semibold">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      {['Luxury', 'Executive', 'AC Standard', 'Sleeper', 'Intercity'].map(type => (
                        <SelectItem key={type} value={type} className="rounded-lg">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Total Seat Capacity</Label>
                  <Input 
                    type="number"
                    min="1"
                    max="60"
                    placeholder="Total seats"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Ticket Price (RWF)</Label>
                  <Input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Origin Terminal</Label>
                  <Select onValueChange={(val) => setFormData({...formData, originBusParkId: val})} defaultValue={formData.originBusParkId}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-semibold">
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-60">
                      {BUS_PARKS.map(park => (
                        <SelectItem key={park} value={park} className="rounded-lg">{park}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Destination Terminal</Label>
                  <Select onValueChange={(val) => setFormData({...formData, destinationBusParkId: val})} defaultValue={formData.destinationBusParkId}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-semibold">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl max-h-60">
                      {BUS_PARKS.map(park => (
                        <SelectItem key={park} value={park} className="rounded-lg">{park}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Departure Schedule</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.departureTime}
                    onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Estimated Arrival</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full h-14 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20 text-lg transition-all active:scale-95"
                >
                  {isSaving ? <Loader2 className="animate-spin h-6 w-6" /> : <><Save className="h-5 w-5 mr-2" /> Publish Schedule</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
