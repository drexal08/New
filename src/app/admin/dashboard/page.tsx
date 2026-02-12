
"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Users, Bus, MapPin, Settings, AlertCircle, ShieldAlert, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminDashboard() {
  const firestore = useFirestore();

  const companiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "transport_companies"), orderBy("name", "asc"));
  }, [firestore]);

  const { data: companies, isLoading } = useCollection(companiesQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
              Platform Admin <ShieldAlert className="h-8 w-8 text-red-500" />
            </h1>
            <p className="text-gray-500 font-medium">System-wide management of users, companies, and infrastructure.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-2xl h-12 px-6">
              <Settings className="h-4 w-4 mr-2" /> System Config
            </Button>
            <Button className="rounded-2xl h-12 px-8 bg-red-600 hover:bg-red-700">
              Emergency Stop
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
                  <p className="text-2xl font-black text-gray-900">{companies?.length || 15}</p>
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
                        {companies && companies.length > 0 ? companies.map(comp => (
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
