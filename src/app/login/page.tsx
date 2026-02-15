"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useUser, useFirestore, initiateEmailSignIn } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Loader2, Mail, Lock, ChevronLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isUserLoading) {
      const checkRoleAndRedirect = async () => {
        // Special Admin Case
        if (user.email === 'byiringirinnocent8@gmail.com') {
          router.push('/admin/dashboard');
          return;
        }

        const userRef = doc(firestore, "user_profiles", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const profile = userSnap.data();
          if (profile.role === 'company') {
            router.push('/company/dashboard');
          } else {
            router.push('/');
          }
        } else {
          // If profile doesn't exist yet, we might need to create one or wait
          router.push('/');
        }
      };
      checkRoleAndRedirect();
    }
  }, [user, isUserLoading, router, firestore]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.includes('@')) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({ title: "Welcome back!", description: "Signing into your BusBook account." });
    } catch (error: any) {
      const message = error.code === 'auth/invalid-credential' 
        ? "Invalid email or password. Please try again."
        : error.message || "Failed to sign in.";
      setAuthError(message);
      toast({ variant: "destructive", title: "Login Failed", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Success!", description: "Logged in with Google." });
    } catch (error: any) {
      setAuthError(error.message);
      toast({ variant: "destructive", title: "Google Login Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Verifying Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 animate-in fade-in duration-500">
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all active:scale-95">
        <ChevronLeft className="h-5 w-5" /> Back to Home
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">Login</CardTitle>
          <CardDescription className="text-white/70 font-medium">Access your BusBook account</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          {authError && (
            <Alert variant="destructive" className="rounded-2xl bg-red-50 border-none text-red-600">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-bold text-xs">{authError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary transition-all"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</Label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-black uppercase text-primary hover:underline tracking-widest">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold focus-visible:ring-primary transition-all"
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all active:scale-95" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span></div>
          </div>

          <Button 
            variant="outline" 
            type="button"
            onClick={handleGoogleLogin} 
            className="w-full h-14 rounded-2xl border-gray-100 bg-white hover:bg-gray-50 font-bold gap-3 shadow-sm transition-all active:scale-95"
            disabled={isSubmitting}
          >
             <svg className="h-5 w-5" viewBox="0 0 24 24">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             Google
          </Button>

          <p className="text-center text-sm text-gray-500 font-medium pt-2">
            Don't have an account? <Link href="/register" className="text-primary font-black hover:underline">Register now</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
