
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, where, orderBy } from "firebase/firestore";
import { Bus as BusIcon, Plus, Trash2, Loader2, ChevronLeft, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ManageBuses() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const profileRef = useMemoFirebase(() => user ? doc(firestore, "user_profiles", user.uid) : null, [firestore, user]);
  const { data: profile } = useDoc(profileRef);

  const companyId = profile?.companyId || user?.uid;

  const busesQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, "transport_companies", companyId, "buses"), orderBy("createdAt", "desc"));
  }, [firestore, companyId]);

  const { data: buses, isLoading } = useCollection(busesQuery);

  const [newBus, setNewBus] = useState({
    registrationNumber: "",
    model: "",
    capacity: "40",
  });

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    setIsSaving(true);
    try {
      const busData = {
        ...newBus,
        capacity: parseInt(newBus.capacity),
        transportCompanyId: companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDocumentNonBlocking(collection(firestore, "transport_companies", companyId, "buses"), busData);
      setNewBus({ registrationNumber: "", model: "", capacity: "40" });
      toast({ title: "Bus Added", description: "Vehicle registered to fleet." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBus = (busId: string) => {
    if (!companyId) return;
    deleteDocumentNonBlocking(doc(firestore, "transport_companies", companyId, "buses", busId));
    toast({ title: "Bus Removed", description: "Vehicle removed from registry." });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/company/dashboard" className="inline-flex items-center text-primary font-bold mb-8 text-xs uppercase tracking-widest">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border-none shadow-xl rounded-3xl h-fit">
            <CardHeader className="bg-primary text-white p-8 rounded-t-3xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="h-6 w-6" /> Add Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleAddBus} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Plate Number</Label>
                  <Input 
                    placeholder="RAB 001 X" 
                    value={newBus.registrationNumber}
                    onChange={(e) => setNewBus({...newBus, registrationNumber: e.target.value.toUpperCase()})}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Make & Model</Label>
                  <Input 
                    placeholder="e.g. Mercedes-Benz" 
                    value={newBus.model}
                    onChange={(e) => setNewBus({...newBus, model: e.target.value})}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Seating Capacity</Label>
                  <Input 
                    type="number"
                    value={newBus.capacity}
                    onChange={(e) => setNewBus({...newBus, capacity: e.target.value})}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full h-12 rounded-xl font-bold bg-accent hover:bg-accent/90">
                  {isSaving ? <Loader2 className="animate-spin" /> : "Register Bus"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-900">Fleet Registry</h2>
               <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl text-accent font-bold text-xs">
                 <ShieldCheck className="h-4 w-4" /> Verified Nodes
               </div>
             </div>

             {isLoading ? (
               <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary opacity-20" /></div>
             ) : buses && buses.length > 0 ? (
               <div className="grid gap-4">
                 {buses.map((bus) => (
                   <Card key={bus.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                     <CardContent className="p-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="bg-gray-100 p-3 rounded-xl">
                           <BusIcon className="h-6 w-6 text-primary" />
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 text-lg">{bus.registrationNumber}</p>
                           <p className="text-xs text-muted-foreground font-medium">{bus.model} • {bus.capacity} Seats</p>
                         </div>
                       </div>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleDeleteBus(bus.id)}
                         className="text-gray-400 hover:text-red-500 rounded-xl"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             ) : (
               <div className="bg-white rounded-3xl p-20 text-center border border-dashed">
                 <BusIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                 <p className="text-muted-foreground font-bold">No vehicles registered.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
