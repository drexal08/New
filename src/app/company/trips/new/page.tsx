
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { BUS_PARKS, TRANSPORT_COMPANIES, MOCK_STATIONS } from "@/lib/mock-data";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function NewTripPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    busName: "Volcano Express",
    originBusParkId: "Nyabugogo Bus Terminal",
    destinationBusParkId: "Rubavu Main Park",
    departureTime: "",
    arrivalTime: "",
    price: "3500",
    status: "Scheduled",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Auth Required", description: "Sign in as a company admin.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const tripData = {
        ...formData,
        price: parseInt(formData.price),
        transportCompanyId: "comp-1", // Simulated
        routeId: `${formData.originBusParkId}-${formData.destinationBusParkId}`,
        busId: "bus-sim",
        bookedSeatNumbers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDocumentNonBlocking(collection(firestore, "trips"), tripData);
      
      toast({ title: "Trip Posted!", description: "Your schedule is now live and searchable." });
      router.push("/company/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/company/dashboard" className="inline-flex items-center text-primary font-bold mb-8 hover:gap-2 transition-all">
          <ChevronLeft className="h-5 w-5" /> Dashboard
        </Link>

        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary text-white p-10">
            <CardTitle className="text-3xl font-black">Add Trip Schedule</CardTitle>
            <p className="text-white/70 font-medium">Define your route, timing and pricing for the general public.</p>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Company / Bus Name</Label>
                  <Select onValueChange={(val) => setFormData({...formData, busName: val})} defaultValue={formData.busName}>
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {TRANSPORT_COMPANIES.map(comp => (
                        <SelectItem key={comp} value={comp} className="rounded-xl py-3">{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Base Price (RWF)</Label>
                  <Input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Origin Terminal</Label>
                  <Select onValueChange={(val) => setFormData({...formData, originBusParkId: val})} defaultValue={formData.originBusParkId}>
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold">
                      <SelectValue placeholder="Select Park" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {BUS_PARKS.map(park => (
                        <SelectItem key={park} value={park} className="rounded-xl py-3">{park}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Destination Terminal</Label>
                  <Select onValueChange={(val) => setFormData({...formData, destinationBusParkId: val})} defaultValue={formData.destinationBusParkId}>
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold">
                      <SelectValue placeholder="Select Park" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {BUS_PARKS.map(park => (
                        <SelectItem key={park} value={park} className="rounded-xl py-3">{park}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Departure Time</Label>
                  <Input 
                    type="datetime-local" 
                    onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Estimated Arrival</Label>
                  <Input 
                    type="datetime-local" 
                    onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full h-16 rounded-[1.25rem] bg-accent hover:bg-accent/90 text-xl font-black shadow-xl shadow-accent/20"
              >
                {isSaving ? <Loader2 className="animate-spin h-6 w-6" /> : <><Save className="h-6 w-6 mr-2" /> Publish Trip</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
