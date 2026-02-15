
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking, useUser } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Users, Bus, MapPin, Settings, AlertCircle, ShieldAlert, TrendingUp, Search, Database, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TRANSPORT_COMPANIES } from "@/lib/mock-data";

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  // SECURE LOCK: Only allow the specific admin email
  useEffect(() => {
    if (!isUserLoading) {
      if (!user || user.email !== 'byiringirinnocent8@gmail.com') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to access the Platform Administration.",
        });
        router.push("/");
      }
    }
  }, [user, isUserLoading, router, toast]);

  const companiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "transport_companies"), orderBy("name", "asc"));
  }, [firestore]);

  const { data: companies, isLoading: isCompaniesLoading } = useCollection(companiesQuery);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      // 1. Seed Transport Companies
      for (const name of TRANSPORT_COMPANIES.slice(0, 8)) {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        setDocumentNonBlocking(doc(firestore, "transport_companies", id), {
          id,
          name,
          contactEmail: `info@${id}.rw`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      // 2. Seed some Trips
      const tripsRef = collection(firestore, "trips");
      const sampleTrips = [
        {
          busName: "Volcano Express",
          registrationNumber: "RAB 450 B",
          originBusParkId: "Nyabugogo Bus Terminal",
          destinationBusParkId: "Rubavu Main Park",
          departureTime: new Date(Date.now() + 86400000).toISOString(),
          arrivalTime: new Date(Date.now() + 86400000 + 14400000).toISOString(),
          price: 3500,
          status: "Scheduled",
          transportCompanyId: "volcano-express",
          bookedSeatNumbers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          busName: "Ritco",
          registrationNumber: "RAB 001 C",
          originBusParkId: "Nyabugogo Bus Terminal",
          destinationBusParkId: "Huye Taxi Park",
          departureTime: new Date(Date.now() + 172800000).toISOString(),
          arrivalTime: new Date(Date.now() + 172800000 + 10800000).toISOString(),
          price: 2800,
          status: "Scheduled",
          transportCompanyId: "ritco",
          bookedSeatNumbers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      for (const trip of sampleTrips) {
        addDocumentNonBlocking(tripsRef, trip);
      }

      toast({
        title: "Database Seeded!",
        description: "Sample trips and companies have been added successfully.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Seed Failed",
        description: e.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isUserLoading || !user || user.email !== 'byiringirinnocent8@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
              Platform Admin <ShieldAlert className="h-8 w-8 text-red-500" />
            </h1>
            <p className="text-gray-500 font-medium">Restricted Access for System-wide management.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              variant="outline" 
              className="rounded-2xl h-12 px-6 border-primary text-primary hover:bg-primary/5"
            >
              {isSeeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
              Seed Demo Data
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 px-6">
              <Settings className="h-4 w-4 mr-2" /> System Config
            </Button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
                  <p className="text-2xl font-black text-gray-900">42,850</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Revenue</p>
                  <p className="text-2xl font-black text-gray-900">12.5M RWF</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Bus className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Companies</p>
                  <p className="text-2xl font-black text-gray-900">{companies?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-2xl">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Parks</p>
                  <p className="text-2xl font-black text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100 flex flex-row items-center justify-between">
                   <CardTitle className="text-xl font-black">Transport Companies</CardTitle>
                   <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search company..." className="pl-10 h-10 rounded-xl bg-gray-50 border-none" />
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Name</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest">Fleet</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isCompaniesLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="p-12 text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-300" />
                            </TableCell>
                          </TableRow>
                        ) : companies && companies.length > 0 ? companies.map(comp => (
                          <TableRow key={comp.id} className="hover:bg-gray-50/50 border-gray-50">
                            <TableCell className="px-8 font-bold">{comp.name}</TableCell>
                            <TableCell>
                               <Badge className="bg-green-500 rounded-full px-3">Active</Badge>
                            </TableCell>
                            <TableCell className="font-bold text-gray-500">25 Buses</TableCell>
                            <TableCell className="text-right px-8">
                               <Button variant="ghost" size="sm" className="font-black text-primary">MANAGE</Button>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={4} className="p-12 text-center text-gray-400 font-bold">
                               No companies registered yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                   </Table>
                </CardContent>
              </Card>
           </div>

           <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem] bg-white">
                 <CardHeader className="p-8">
                    <CardTitle className="text-xl font-black">System Status</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-bold text-green-700">API Gateway</span>
                       </div>
                       <Badge variant="outline" className="border-green-200 text-green-700 font-bold">99.9%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-bold text-green-700">Database</span>
                       </div>
                       <Badge variant="outline" className="border-green-200 text-green-700 font-bold">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="font-bold text-yellow-700">Payment Gateway</span>
                       </div>
                       <Badge variant="outline" className="border-yellow-200 text-yellow-700 font-bold">Degraded</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem] bg-primary text-white p-8">
                 <div className="flex items-center gap-4 mb-4">
                    <AlertCircle className="h-6 w-6" />
                    <h3 className="text-lg font-black uppercase tracking-tight">System Notice</h3>
                 </div>
                 <p className="text-white/80 font-medium text-sm leading-relaxed">
                    Routine maintenance scheduled for Saturday 2:00 AM CAT. Intercity syncing might experience 5min delay.
                 </p>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
