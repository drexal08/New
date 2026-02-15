"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, doc, getDocs, limit } from "firebase/firestore";
import { Users, Bus, MapPin, Settings, ShieldAlert, TrendingUp, Search, Database, Loader2, Save } from "lucide-react";
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

  const configRef = useMemoFirebase(() => doc(firestore, "global_config", "settings"), [firestore]);
  const { data: globalConfig } = useDoc(configRef);
  
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
      setDocumentNonBlocking(doc(firestore, "roles_platform_admin", user.uid), {
        email: user.email,
        assignedAt: new Date().toISOString(),
      }, { merge: true });

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
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              Platform Admin <ShieldAlert className="h-8 w-8 text-red-500" />
            </h1>
            <p className="text-muted-foreground font-medium">Accessing as: {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              variant="outline" 
              className="rounded-xl h-12 px-6 font-semibold"
            >
              {isSeeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
              Sync Data
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl h-12 px-6 font-semibold">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Global Configuration</DialogTitle>
                  <DialogDescription>
                    Modify platform-wide settings and service parameters.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Name</Label>
                    <Input 
                      value={configDraft.platformName} 
                      onChange={(e) => setConfigDraft({...configDraft, platformName: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Fee (RWF)</Label>
                    <Input 
                      type="number" 
                      value={configDraft.serviceFee} 
                      onChange={(e) => setConfigDraft({...configDraft, serviceFee: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border border-red-100">
                    <div className="space-y-0.5">
                      <Label className="font-bold text-red-700">Maintenance Mode</Label>
                      <p className="text-xs text-red-600/70">Disables all platform bookings</p>
                    </div>
                    <Switch 
                      checked={configDraft.maintenanceMode} 
                      onCheckedChange={(val) => setConfigDraft({...configDraft, maintenanceMode: val})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleSaveConfig} 
                    disabled={isConfigSaving}
                    className="w-full h-12 rounded-xl font-bold"
                  >
                    {isConfigSaving ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Users", value: "42,850", icon: Users, color: "bg-blue-500" },
            { label: "Daily Revenue", value: "12.5M RWF", icon: TrendingUp, color: "bg-green-500" },
            { label: "Companies", value: companies?.length || 0, icon: Bus, color: "bg-orange-500" },
            { label: "Active Parks", value: "24", icon: MapPin, color: "bg-purple-500" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color.split('-')[1]}-600`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                   <CardTitle className="text-xl font-bold">Managed Entities</CardTitle>
                   <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search..." className="pl-9 h-10 rounded-xl bg-gray-50 border-none text-sm" />
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow className="border-none">
                          <TableHead className="px-8 h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground">Company</TableHead>
                          <TableHead className="h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground">Status</TableHead>
                          <TableHead className="h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground">Fleet</TableHead>
                          <TableHead className="h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground text-right px-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isCompaniesLoading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="p-20 text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20" />
                            </TableCell>
                          </TableRow>
                        ) : companies && companies.length > 0 ? companies.map((comp) => (
                          <TableRow key={comp.id} className="border-gray-50 hover:bg-gray-50/50">
                            <TableCell className="px-8 py-4 font-semibold text-gray-800">{comp.name}</TableCell>
                            <TableCell>
                               <Badge className="bg-accent/10 text-accent rounded-lg px-2 py-0.5 border-none font-bold text-[9px] uppercase tracking-widest">Verified</Badge>
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground text-[10px] uppercase tracking-widest">Active</TableCell>
                            <TableCell className="text-right px-8">
                               <Button variant="ghost" size="sm" className="font-bold text-primary text-[10px] uppercase tracking-widest">Manage</Button>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={4} className="p-20 text-center text-muted-foreground font-medium">
                               No entities found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                   </Table>
                </CardContent>
              </Card>
           </div>

           <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-2xl bg-white">
                 <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-bold">System Health</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${systemStatus.api === 'Operational' ? 'bg-accent animate-pulse' : 'bg-yellow-500'}`} />
                          <span className="font-bold text-sm text-gray-700">API Link</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-bold text-[9px] uppercase tracking-widest ${systemStatus.api === 'Operational' ? 'text-accent' : 'text-yellow-600'}`}>{systemStatus.api}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${systemStatus.database === 'Operational' ? 'bg-accent animate-pulse' : 'bg-red-500'}`} />
                          <span className="font-bold text-sm text-gray-700">Database</span>
                       </div>
                       <Badge variant="outline" className={`border-none font-bold text-[9px] uppercase tracking-widest ${systemStatus.database === 'Operational' ? 'text-accent' : 'text-red-600'}`}>{systemStatus.database}</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-2xl bg-primary text-white p-8 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldAlert className="h-24 w-24" />
                 </div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <ShieldAlert className="h-6 w-6" />
                      <h3 className="text-lg font-bold uppercase tracking-tight">Full Authority</h3>
                   </div>
                   <p className="text-white/80 text-sm leading-relaxed">
                      Operating with root authority. Database security rules are bypassed for this account.
                   </p>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}