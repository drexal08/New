
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Users, ShieldAlert, TrendingUp, Search, Database, Loader2, Building2, MapPin, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminDashboard() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConfigSaving, setIsConfigSaving] = useState(false);

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
        toast({ variant: "destructive", title: "Access Denied", description: "Root authority required." });
        router.push("/");
      }
    }
  }, [user, isUserLoading, router, toast]);

  const companiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "transport_companies"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: companies, isLoading: isCompaniesLoading } = useCollection(companiesQuery);

  const handleSyncPermissions = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      setDocumentNonBlocking(doc(firestore, "roles_platform_admin", user.uid), {
        email: user.email,
        assignedAt: new Date().toISOString(),
        verified: true
      }, { merge: true });

      toast({ title: "Authority Synced", description: "Administrative permissions have been refreshed." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message });
    } finally {
      setIsSyncing(false);
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

      toast({ title: "Configuration Saved", description: "Global parameters updated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Save Failed", description: e.message });
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              Platform Registry <ShieldAlert className="h-8 w-8 text-primary" />
            </h1>
            <p className="text-muted-foreground font-medium">Managing verified nodes for {configDraft.platformName}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSyncPermissions} 
              disabled={isSyncing}
              variant="outline" 
              className="rounded-xl h-12 px-6 font-bold"
            >
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
              Refresh Registry
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl h-12 px-6 font-bold">
                  <Settings className="h-4 w-4 mr-2" /> Global Config
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">System Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform Brand</Label>
                    <Input 
                      value={configDraft.platformName} 
                      onChange={(e) => setConfigDraft({...configDraft, platformName: e.target.value})}
                      className="h-12 rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Booking Fee (RWF)</Label>
                    <Input 
                      type="number" 
                      value={configDraft.serviceFee} 
                      onChange={(e) => setConfigDraft({...configDraft, serviceFee: e.target.value})}
                      className="h-12 rounded-xl font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border border-red-100">
                    <Label className="font-bold text-red-700">Maintenance Mode</Label>
                    <Switch 
                      checked={configDraft.maintenanceMode} 
                      onCheckedChange={(val) => setConfigDraft({...configDraft, maintenanceMode: val})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveConfig} disabled={isConfigSaving} className="w-full h-12 rounded-xl font-bold">
                    {isConfigSaving ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Parameters"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Partner Nodes", value: companies?.length || 0, icon: Building2, color: "bg-primary" },
            { label: "Active Parks", value: "24", icon: MapPin, color: "bg-accent" },
            { label: "Network Users", value: "4.2k", icon: Users, color: "bg-orange-500" },
            { label: "Revenue Core", value: "12.5M", icon: TrendingUp, color: "bg-teal-600" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
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

        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
             <CardTitle className="text-xl font-bold">Transport Partners</CardTitle>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search partners..." className="pl-9 h-10 rounded-xl bg-gray-50 border-none text-xs" />
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-none">
                    <TableHead className="px-8 h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground">Entity</TableHead>
                    <TableHead className="h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="h-12 font-bold uppercase text-[9px] tracking-widest text-muted-foreground text-right px-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isCompaniesLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20" /></TableCell>
                    </TableRow>
                  ) : companies && companies.length > 0 ? companies.map((comp) => (
                    <TableRow key={comp.id} className="border-gray-50 hover:bg-gray-50/50">
                      <TableCell className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{comp.name}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{comp.contactEmail || comp.email}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <Badge className={`${comp.status === 'Active' ? 'bg-accent/10 text-accent' : 'bg-yellow-500/10 text-yellow-600'} rounded-lg px-2 py-0.5 border-none font-bold text-[9px] uppercase tracking-widest`}>
                           {comp.status || 'Verified'}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                         <Button variant="ghost" size="sm" className="font-bold text-primary text-[10px] uppercase tracking-widest">Audit</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="p-20 text-center text-muted-foreground font-medium">No partners registered.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
