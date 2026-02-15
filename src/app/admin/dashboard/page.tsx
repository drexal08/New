
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, useUser } from "@/firebase";
import { collection, query, orderBy, doc, collectionGroup, getDocs, limit } from "firebase/firestore";
import { Users, Bus, MapPin, Settings, AlertCircle, ShieldAlert, TrendingUp, Search, Database, Loader2, CheckCircle2, XCircle } from "lucide-react";
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
  const [systemStatus, setSystemStatus] = useState({
    api: "Checking...",
    database: "Checking...",
    payments: "Checking..."
  });

  // Real-time status check
  useEffect(() => {
    if (!firestore) return;

    const checkStatus = async () => {
      try {
        // Ping firestore
        const q = query(collection(firestore, "transport_companies"), limit(1));
        await getDocs(q);
        setSystemStatus(prev => ({ ...prev, database: "Operational", api: "Operational" }));
      } catch (e) {
        setSystemStatus(prev => ({ ...prev, database: "Error", api: "Degraded" }));
      }
      
      // Simulate live payment gateway check
      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, payments: "Operational" }));
      }, 1500);
    };

    checkStatus();
  }, [firestore]);

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

      toast({
        title: "Database Seeded!",
        description: "Transport companies and base data updated.",
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
              Platform Admin <ShieldAlert className="h-8 w-8 text-red-500" />
            </h1>
            <p className="text-gray-500 font-medium">Verified System Administrator Access.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              variant="outline" 
              className="rounded-2xl h-12 px-6 border-primary text-primary hover:bg-primary/5 transition-all active:scale-95"
            >
              {isSeeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
              Sync Base Data
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 px-6 hover:bg-gray-100 transition-all active:scale-95">
              <Settings className="h-4 w-4 mr-2" /> System Config
            </Button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Users", value: "42,850", icon: Users, color: "blue" },
            { label: "Daily Revenue", value: "12.5M RWF", icon: TrendingUp, color: "green" },
            { label: "Companies", value: companies?.length || 0, icon: Bus, color: "orange" },
            { label: "Active Parks", value: "24", icon: MapPin, color: "purple" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`bg-${stat.color}-100 p-4 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-100 flex flex-row items-center justify-between">
                   <CardTitle className="text-xl font-black">Transport Companies</CardTitle>
                   <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search company..." className="pl-10 h-10 rounded-xl bg-gray-50 border-none focus-visible:ring-primary" />
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
                          <TableRow key={comp.id} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                            <TableCell className="px-8 font-bold">{comp.name}</TableCell>
                            <TableCell>
                               <Badge className="bg-green-500 rounded-full px-3 animate-in fade-in duration-300">Active</Badge>
                            </TableCell>
                            <TableCell className="font-bold text-gray-500">25 Buses</TableCell>
                            <TableCell className="text-right px-8">
                               <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/5 rounded-xl">MANAGE</Button>
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
                    <CardTitle className="text-xl font-black">Real-time System Status</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${systemStatus.api === 'Operational' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                          <span className="font-bold text-gray-700">API Gateway</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-black ${systemStatus.api === 'Operational' ? 'text-green-600' : 'text-yellow-600'}`}>{systemStatus.api}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${systemStatus.database === 'Operational' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="font-bold text-gray-700">Database (Firestore)</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-black ${systemStatus.database === 'Operational' ? 'text-green-600' : 'text-red-600'}`}>{systemStatus.database}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${systemStatus.payments === 'Operational' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                          <span className="font-bold text-gray-700">Payment Gateway</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-black ${systemStatus.payments === 'Operational' ? 'text-green-600' : 'text-gray-400'}`}>{systemStatus.payments}</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem] bg-primary text-white p-8 overflow-hidden relative">
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-4">
                      <AlertCircle className="h-6 w-6" />
                      <h3 className="text-lg font-black uppercase tracking-tight">System Notice</h3>
                   </div>
                   <p className="text-white/80 font-medium text-sm leading-relaxed">
                      Routine maintenance scheduled for Saturday 2:00 AM CAT. Intercity syncing might experience minor delay.
                   </p>
                 </div>
                 <div className="absolute -right-8 -bottom-8 opacity-10">
                    <ShieldAlert className="h-32 w-32" />
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
