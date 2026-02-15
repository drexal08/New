"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, doc, getDocs, limit } from "firebase/firestore";
import { Users, Bus, MapPin, Settings, AlertCircle, ShieldAlert, TrendingUp, Search, Database, Loader2, Save, Globe, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { TRANSPORT_COMPANIES } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isConfigSaving, setIsConfigSaving] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    api: "Checking...",
    database: "Checking...",
    payments: "Checking..."
  });

  const ADMIN_EMAIL = 'byiringirinnocent8@gmail.com';

  // Global Config State
  const configRef = useMemoFirebase(() => doc(firestore, "global_config", "settings"), [firestore]);
  const { data: globalConfig, isLoading: isConfigLoading } = useDoc(configRef);
  
  const [configDraft, setConfigDraft] = useState({
    serviceFee: "350",
    maintenanceMode: false,
    platformName: "BusBook Rwanda",
  });

  useEffect(() => {
    if (globalConfig) {
      setConfigDraft({
        serviceFee: globalConfig.serviceFee?.toString() || "350",
        maintenanceMode: globalConfig.maintenanceMode || false,
        platformName: globalConfig.platformName || "BusBook Rwanda",
      });
    }
  }, [globalConfig]);

  // SECURE LOCK: Only allow the specific admin email
  useEffect(() => {
    if (!isUserLoading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to access the Platform Administration.",
        });
        router.push("/");
      }
    }
  }, [user, isUserLoading, router, toast]);

  // Real-time status check
  useEffect(() => {
    if (!firestore || !user || user.email !== ADMIN_EMAIL) return;

    const checkStatus = async () => {
      try {
        const q = query(collection(firestore, "transport_companies"), limit(1));
        await getDocs(q);
        setSystemStatus(prev => ({ ...prev, database: "Operational", api: "Operational" }));
      } catch (e) {
        setSystemStatus(prev => ({ ...prev, database: "Error", api: "Degraded" }));
      }
      
      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, payments: "Operational" }));
      }, 1500);
    };

    checkStatus();
  }, [firestore, user]);

  const companiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "transport_companies"), orderBy("name", "asc"));
  }, [firestore]);

  const { data: companies, isLoading: isCompaniesLoading } = useCollection(companiesQuery);

  const handleSeedData = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      // 1. Sync Platform Admin Role
      setDocumentNonBlocking(doc(firestore, "roles_platform_admin", user.uid), {
        email: user.email,
        assignedAt: new Date().toISOString(),
      }, { merge: true });

      // 2. Seed Transport Companies
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
        title: "System Synced",
        description: "Administrative roles and company data have been updated.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: e.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsConfigSaving(true);
    try {
      setDocumentNonBlocking(doc(firestore, "global_config", "settings"), {
        ...configDraft,
        serviceFee: parseInt(configDraft.serviceFee),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email,
      }, { merge: true });

      toast({
        title: "Configuration Saved",
        description: "Global settings have been updated across the platform.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: e.message,
      });
    } finally {
      setIsConfigSaving(false);
    }
  };

  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 flex items-center gap-4 tracking-tighter">
              Platform Admin <ShieldAlert className="h-10 w-10 text-red-500 animate-pulse" />
            </h1>
            <p className="text-gray-500 font-bold text-lg uppercase tracking-widest opacity-60">Full System Access: {user.email}</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              variant="outline" 
              className="rounded-2xl h-16 px-8 border-primary/20 text-primary hover:bg-primary/5 transition-all active:scale-95 font-black text-base"
            >
              {isSeeding ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Database className="h-5 w-5 mr-3" />}
              Sync System Data
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-2xl h-16 px-8 border-gray-200 hover:bg-gray-100 transition-all active:scale-95 font-black text-base">
                  <Settings className="h-5 w-5 mr-3" /> Global Config
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-[3rem] p-12 border-none shadow-2xl animate-in fade-in zoom-in duration-300">
                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-black tracking-tight">Global Configuration</DialogTitle>
                  <DialogDescription className="font-bold text-gray-500 text-lg">
                    Modify platform-wide settings and service parameters.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-10 py-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Platform Name</Label>
                    <Input 
                      value={configDraft.platformName} 
                      onChange={(e) => setConfigDraft({...configDraft, platformName: e.target.value})}
                      className="h-16 rounded-[1.25rem] bg-gray-50 border-none font-black text-lg focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Default Service Fee (RWF)</Label>
                    <Input 
                      type="number" 
                      value={configDraft.serviceFee} 
                      onChange={(e) => setConfigDraft({...configDraft, serviceFee: e.target.value})}
                      className="h-16 rounded-[1.25rem] bg-gray-50 border-none font-black text-lg focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="flex items-center justify-between p-8 bg-red-50 rounded-[2rem] border border-red-100">
                    <div className="space-y-1">
                      <Label className="font-black text-red-600 text-lg">Maintenance Mode</Label>
                      <p className="text-xs text-red-400 font-black uppercase tracking-widest">Disables all platform bookings</p>
                    </div>
                    <Switch 
                      checked={configDraft.maintenanceMode} 
                      onCheckedChange={(val) => setConfigDraft({...configDraft, maintenanceMode: val})}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-8">
                  <Button 
                    onClick={handleSaveConfig} 
                    disabled={isConfigSaving}
                    className="w-full h-16 rounded-[1.25rem] bg-primary font-black text-xl gap-4 shadow-xl shadow-primary/20 hover:shadow-none transition-all active:scale-95"
                  >
                    {isConfigSaving ? <Loader2 className="animate-spin h-6 w-6" /> : <><Save className="h-6 w-6" /> Save Changes</>}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Total Users", value: "42,850", icon: Users, color: "bg-blue-500" },
            { label: "Daily Revenue", value: "12.5M RWF", icon: TrendingUp, color: "bg-green-500" },
            { label: "Companies", value: companies?.length || 0, icon: Bus, color: "bg-orange-500" },
            { label: "Active Parks", value: "24", icon: MapPin, color: "bg-purple-500" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in zoom-in" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[1.5rem] ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-8 w-8 text-${stat.color.split('-')[1]}-600`} />
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

        <div className="grid lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2">
              <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-10 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                   <CardTitle className="text-2xl font-black tracking-tight">Managed Entities</CardTitle>
                   <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input placeholder="Search companies..." className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary/20" />
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <Table>
                      <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="px-10 h-16 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Company Name</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Access Status</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Fleet Visibility</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 text-right px-10">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isCompaniesLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="p-24 text-center">
                              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary opacity-20" />
                            </TableCell>
                          </TableRow>
                        ) : companies && companies.length > 0 ? companies.map((comp, idx) => (
                          <TableRow key={comp.id} className="hover:bg-gray-50/50 border-gray-50 transition-colors group animate-in fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                            <TableCell className="px-10 py-6 font-black text-gray-800 text-lg">{comp.name}</TableCell>
                            <TableCell>
                               <Badge className="bg-accent/10 text-accent rounded-full px-4 py-1 border-none font-black text-[10px] uppercase tracking-widest">Verified</Badge>
                            </TableCell>
                            <TableCell className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">Global Live</TableCell>
                            <TableCell className="text-right px-10">
                               <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/5 rounded-xl uppercase tracking-widest text-[10px] h-10 px-6">Manage</Button>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={4} className="p-24 text-center text-gray-400 font-black text-lg">
                               No entities synchronized. Use the "Sync System Data" button.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                   </Table>
                </CardContent>
              </Card>
           </div>

           <div className="space-y-8">
              <Card className="border-none shadow-xl shadow-gray-200/40 rounded-[3rem] bg-white overflow-hidden">
                 <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-2xl font-black tracking-tight">System Health</CardTitle>
                 </CardHeader>
                 <CardContent className="p-10 pt-0 space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-primary/20 transition-all duration-300 group">
                       <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${systemStatus.api === 'Operational' ? 'bg-accent animate-pulse' : 'bg-yellow-500'}`} />
                          <span className="font-black text-gray-700 tracking-tight">API Link</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-black text-[10px] uppercase tracking-widest ${systemStatus.api === 'Operational' ? 'text-accent' : 'text-yellow-600'}`}>{systemStatus.api}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-primary/20 transition-all duration-300 group">
                       <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${systemStatus.database === 'Operational' ? 'bg-accent animate-pulse' : 'bg-red-500'}`} />
                          <span className="font-black text-gray-700 tracking-tight">Firestore DB</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-black text-[10px] uppercase tracking-widest ${systemStatus.database === 'Operational' ? 'text-accent' : 'text-red-600'}`}>{systemStatus.database}</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-2xl rounded-[3rem] bg-primary text-white p-12 overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <ShieldAlert className="h-32 w-32" />
                 </div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-5 mb-6">
                      <div className="bg-white/20 p-3 rounded-2xl">
                        <AlertCircle className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Full Authority</h3>
                   </div>
                   <p className="text-white/80 font-bold text-lg leading-relaxed">
                      You are operating with full system authority. Security rules are bypassed for this account across all collections.
                   </p>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
