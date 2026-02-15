"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, initiatePasswordReset } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Loader2, Mail, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const auth = useAuth();
  const { toast } = useToast();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await initiatePasswordReset(auth, email);
      setIsSent(true);
      toast({ 
        title: "Reset Link Sent", 
        description: "A secure reset link has been dispatched to your inbox." 
      });
    } catch (error: any) {
      const message = error.code === 'auth/user-not-found'
        ? "No account found with this email. Please check and try again."
        : error.message || "Failed to send reset link.";
      setError(message);
      toast({ 
        variant: "destructive", 
        title: "Request Failed", 
        description: message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 animate-in fade-in duration-500">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all active:scale-95 text-xs uppercase tracking-widest">
        <ChevronLeft className="h-5 w-5" /> Back to Login
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">Reset Password</CardTitle>
          <CardDescription className="text-white/70 font-medium">Verify your identity to reset</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          {!isSent ? (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-2xl bg-red-50 border-none text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold text-xs">{error}</AlertDescription>
                </Alert>
              )}
              
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Enter your registered email below. We will send you a secure link to reset your password and verify your account ownership.
              </p>

              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
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
                <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/10 transition-all active:scale-95" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-4 space-y-8 animate-in zoom-in duration-500">
              <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-gray-900">Link Dispatched!</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed px-4">
                  We've sent a secure password reset link to <span className="font-bold text-gray-900 underline decoration-primary/20">{email}</span>. 
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Step</p>
                   <p className="text-xs font-bold text-gray-600 mt-1">Open your email app and follow the instructions. If you don't see it, check your spam folder.</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-gray-100 font-black uppercase tracking-widest text-xs transition-all active:scale-95">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
