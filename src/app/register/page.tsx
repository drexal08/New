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
import { Bus, Loader2, User, Mail, Lock, ChevronLeft, ShieldCheck, UserCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "passenger" as "passenger" | "company",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isUserLoading) {
      const createProfile = async () => {
        try {
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
              description: "A secure link was sent to your email to verify your identity." 
            });
          }

          toast({ 
            title: "Account Created!", 
            description: `Welcome! You are now registered as a ${formData.role === 'company' ? 'Bus Operator' : 'Passenger'}.` 
          });
          
          setTimeout(() => {
            if (formData.role === 'company') {
              router.push("/company/dashboard");
            } else {
              router.push("/");
            }
          }, 1000);
        } catch (e: any) {
          setRegError(e.message || "Failed to finalize your profile.");
        }
      };

      createProfile();
    }
  }, [user, isUserLoading, router, firestore, formData.name, formData.email, formData.role, toast]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (formData.name.length < 3) {
      setRegError("Full name must be at least 3 characters.");
      return;
    }

    if (!formData.email.includes('@')) {
      setRegError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 8) {
      setRegError("Security requirement: Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await initiateEmailSignUp(auth, formData.email, formData.password);
    } catch (error: any) {
      const message = error.code === 'auth/email-already-in-use'
        ? "This email is already registered. Try logging in instead."
        : error.message || "Registration failed.";
      setRegError(message);
      toast({ variant: "destructive", title: "Registration Error", description: message });
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Finalizing Security Profile...</p>
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
          <CardDescription className="text-white/70 font-medium">Join the BusBook Rwanda community</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          {regError && (
            <Alert variant="destructive" className="rounded-2xl bg-red-50 border-none text-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-bold text-xs">{regError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 block text-center">Select Account Type</Label>
            <Tabs defaultValue="passenger" className="w-full" onValueChange={(v) => setFormData({...formData, role: v as any})}>
              <TabsList className="grid grid-cols-2 h-14 rounded-2xl p-1 bg-gray-100">
                <TabsTrigger value="passenger" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  <UserCircle className="h-4 w-4" /> Passenger
                </TabsTrigger>
                <TabsTrigger value="company" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
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
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary transition-all"
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
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary transition-all"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Password (Min 8 chars)</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary transition-all"
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg transition-all active:scale-95 shadow-xl shadow-primary/10" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Create Secure Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
