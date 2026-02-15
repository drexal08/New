
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useFirestore, useUser, setDocumentNonBlocking, initiateEmailSignUp, initiateEmailVerification } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Loader2, User, Mail, Lock, ChevronLeft, ShieldCheck, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "passenger" as "passenger" | "company",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isUserLoading) {
      const createProfile = async () => {
        try {
          // Capturing separate names for professional profile
          const nameParts = formData.name.trim().split(/\s+/);
          const firstName = nameParts[0] || 'Traveler';
          const lastName = nameParts.slice(1).join(' ') || '';

          if (!user.displayName && formData.name) {
            await updateProfile(user, { displayName: formData.name });
          }

          const userProfile = {
            id: user.uid,
            firstName,
            lastName,
            email: user.email || formData.email,
            role: formData.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setDocumentNonBlocking(doc(firestore, "user_profiles", user.uid), userProfile, { merge: true });
          
          if (!user.emailVerified) {
            await initiateEmailVerification(user);
            toast({ 
              title: "Verification Sent", 
              description: "Please check your inbox to verify your account." 
            });
          }

          toast({ 
            title: "Welcome to BusBook!", 
            description: `Successfully registered as a ${formData.role === 'company' ? 'Bus Operator' : 'Passenger'}.` 
          });
          
          // Smooth redirect
          setTimeout(() => {
            if (formData.role === 'company') {
              router.push("/company/dashboard");
            } else {
              router.push("/");
            }
          }, 1000);
        } catch (e) {
          console.error("Profile sync error:", e);
        }
      };

      createProfile();
    }
  }, [user, isUserLoading, router, firestore, formData.name, formData.email, formData.role, toast]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      toast({ variant: "destructive", title: "Role Required", description: "Please choose your account type." });
      return;
    }
    setIsSubmitting(true);
    initiateEmailSignUp(auth, formData.email, formData.password);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Finalizing Account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 animate-in fade-in duration-700">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all active:scale-95">
        <ChevronLeft className="h-5 w-5" /> Already have an account? Login
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">Register</CardTitle>
          <CardDescription className="text-white/70 font-medium">Join BusBook Rwanda today</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 block text-center">I am registering as a...</Label>
            <Tabs defaultValue="passenger" className="w-full" onValueChange={(v) => setFormData({...formData, role: v as any})}>
              <TabsList className="grid grid-cols-2 h-14 rounded-2xl p-1 bg-gray-100">
                <TabsTrigger value="passenger" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <UserCircle className="h-4 w-4" /> Passenger
                </TabsTrigger>
                <TabsTrigger value="company" className="rounded-xl font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <ShieldCheck className="h-4 w-4" /> Operator
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="e.g. Byiringiro Innocent" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary"
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg transition-all active:scale-95 shadow-xl shadow-primary/10" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
