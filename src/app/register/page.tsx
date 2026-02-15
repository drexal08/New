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
            title: "Success!", 
            description: `Registered as a ${formData.role === 'company' ? 'Operator' : 'Passenger'}.` 
          });
          
          setTimeout(() => {
            if (formData.role === 'company') {
              router.push("/company/dashboard");
            } else {
              router.push("/");
            }
          }, 1000);
        } catch (e: any) {
          setRegError(e.message || "Failed to finalize profile.");
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

    if (formData.password.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await initiateEmailSignUp(auth, formData.email, formData.password);
    } catch (error: any) {
      const message = error.code === 'auth/email-already-in-use'
        ? "This email is already registered."
        : error.message || "Registration failed.";
      setRegError(message);
      toast({ variant: "destructive", title: "Registration Error", description: message });
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">Processing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-primary font-bold hover:underline transition-all active:scale-95 text-xs uppercase tracking-widest">
        <ChevronLeft className="h-4 w-4" /> Already have an account? Login
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 text-center">
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Register</CardTitle>
          <CardDescription className="text-white/70 font-medium">Join the community</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10 space-y-6">
          {regError && (
            <Alert variant="destructive" className="rounded-xl border-none bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-bold text-xs">{regError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block text-center">Account Type</Label>
            <Tabs defaultValue="passenger" className="w-full" onValueChange={(v) => setFormData({...formData, role: v as any})}>
              <TabsList className="grid grid-cols-2 h-12 rounded-xl p-1 bg-gray-100">
                <TabsTrigger value="passenger" className="rounded-lg font-bold text-[10px] uppercase tracking-widest gap-1.5 data-[state=active]:bg-white">
                  <UserCircle className="h-3.5 w-3.5" /> Passenger
                </TabsTrigger>
                <TabsTrigger value="company" className="rounded-lg font-bold text-[10px] uppercase tracking-widest gap-1.5 data-[state=active]:bg-white">
                  <ShieldCheck className="h-3.5 w-3.5" /> Operator
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g. Byiringiro Innocent" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/50"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/50"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password (Min 8 chars)</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-11 h-12 rounded-xl border-gray-100 bg-gray-50/50"
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold transition-all active:scale-95 shadow-lg shadow-primary/10" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}