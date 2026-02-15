"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, initiatePasswordReset } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Loader2, Mail, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await initiatePasswordReset(auth, email);
      setIsSent(true);
      toast({ 
        title: "Reset Link Sent", 
        description: "Please check your inbox for instructions to reset your password." 
      });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "Failed to send reset link." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Link href="/login" className="mb-8 flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
        <ChevronLeft className="h-5 w-5" /> Back to Login
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white p-10 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">Reset Password</CardTitle>
          <CardDescription className="text-white/70 font-medium">We'll send you a secure link</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          {!isSent ? (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-gray-50 border-none font-bold"
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">Email Sent!</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  We've sent a password reset link to <span className="font-bold text-gray-900">{email}</span>. Please check your junk/spam folder if you don't see it.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl border-gray-200 font-bold">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
