
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCollection, useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, where, orderBy } from "firebase/firestore";
import { Route as RouteIcon, Plus, Trash2, Loader2, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ManageRoutes() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const profileRef = useMemoFirebase(() => user ? doc(firestore, "user_profiles", user.uid) : null, [firestore, user]);
  const { data: profile } = useDoc(profileRef);

  const locationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "locations"), orderBy("name", "asc"));
  }, [firestore]);
  const { data: locations } = useCollection(locationsQuery);

  const companyId = profile?.companyId || user?.uid;

  const routesQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, "routes"), where("companyId", "==", companyId));
  }, [firestore, companyId]);

  const { data: routes, isLoading } = useCollection(routesQuery);

  const [newRoute, setNewRoute] = useState({
    originLocationId: "",
    destinationLocationId: "",
    description: "",
  });

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !newRoute.originLocationId || !newRoute.destinationLocationId) return;

    setIsSaving(true);
    try {
      const routeData = {
        ...newRoute,
        companyId: companyId,
        createdAt: new Date().toISOString(),
      };

      await addDocumentNonBlocking(collection(firestore, "routes"), routeData);
      setNewRoute({ originLocationId: "", destinationLocationId: "", description: "" });
      toast({ title: "Route Published", description: "Operational path added to registry." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    deleteDocumentNonBlocking(doc(firestore, "routes", routeId));
    toast({ title: "Route Removed", description: "Operational path deleted." });
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
                <Plus className="h-6 w-6" /> Define Route
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleAddRoute} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Origin Node</Label>
                  <Select onValueChange={(val) => setNewRoute({...newRoute, originLocationId: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations?.map(loc => <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Destination Node</Label>
                  <Select onValueChange={(val) => setNewRoute({...newRoute, destinationLocationId: val})}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations?.map(loc => <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Public Label</Label>
                  <Input 
                    placeholder="e.g. Kigali - Musanze Direct" 
                    value={newRoute.description}
                    onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full h-12 rounded-xl font-bold bg-accent hover:bg-accent/90">
                  {isSaving ? <Loader2 className="animate-spin" /> : "Publish Route"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-900">Route Directory</h2>
             </div>

             {isLoading ? (
               <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary opacity-20" /></div>
             ) : routes && routes.length > 0 ? (
               <div className="grid gap-4">
                 {routes.map((route) => (
                   <Card key={route.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                     <CardContent className="p-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="bg-gray-100 p-3 rounded-xl">
                           <MapPin className="h-6 w-6 text-primary" />
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 text-lg">{route.description || `${route.originLocationId} → ${route.destinationLocationId}`}</p>
                           <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{route.originLocationId} to {route.destinationLocationId}</p>
                         </div>
                       </div>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleDeleteRoute(route.id)}
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
                 <RouteIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                 <p className="text-muted-foreground font-bold">No operational routes defined.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
