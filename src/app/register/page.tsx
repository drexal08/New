
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useFirestore, useUser, setDocumentNonBlocking, initiateEmailSignUp } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Loader2, User, Mail, Lock, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Handle profile creation and redirection when user state changes
  useEffect(() => {
    if (user && !isUserLoading) {
      // If we're in the middle of registration, ensure profile exists
      const createProfile = async () => {
        try {
          // Update display name if not set
          if (!user.displayName && formData.name) {
            await updateProfile(user, { displayName: formData.name });
          }

          const userProfile = {
            id: user.uid,
            firstName: formData.name.split(' ')[0] || user.displayName?.split(' ')[0] || 'Traveler',
            lastName: formData.name.split(' ').slice(1).join(' ') || '',
            email: user.email || formData.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setDocumentNonBlocking(doc(firestore, "user_profiles", user.uid), userProfile, { merge: true });
          
          toast({ title: "Account Created!", description: "Welcome to BusBook Rwanda." });
          router.push("/");
        } catch (e) {
          console.error("Profile sync error:", e);
        }
      };

      createProfile();
    }
  }, [user, isUserLoading, router, firestore, formData.name, formData.email, toast]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Non-blocking sign up
    initiateEmailSignUp(auth, formData.email, formData.password);
    
    toast({ title: "Creating Account", description: "Connecting to secure auth servers..." });
    
    // Reset submitting state after a delay
    setTimeout(() => setIsSubmitting(false), 3000);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Preparing Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
        <ChevronLeft className="h-5 w-5" /> Already have an account? Login
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-accent text-white p-10 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">Register</CardTitle>
          <CardDescription className="text-white/70 font-medium">Create your BusBook Rwanda account</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold"
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 font-black text-lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
