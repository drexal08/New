
"use client";

import Link from "next/link";
import { Bus, User, Ticket, Menu, LayoutDashboard, LogIn, LogOut, PlusCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  // Real role management would use custom claims or firestore lookups
  // For demo, we use a simple local state to simulate role-based navigation
  const [role, setRole] = useState<'passenger' | 'company' | 'admin'>('passenger');

  useEffect(() => {
    const savedRole = localStorage.getItem('user-role') as any;
    if (savedRole) setRole(savedRole);
  }, []);

  const switchRole = (newRole: 'passenger' | 'company' | 'admin') => {
    setRole(newRole);
    localStorage.setItem('user-role', newRole);
    if (newRole === 'company') router.push('/company/dashboard');
    else if (newRole === 'admin') router.push('/admin/dashboard');
    else router.push('/');
  };

  const handleSignOut = () => {
    signOut(auth);
    localStorage.removeItem('user-role');
    router.push("/");
  };

  const isCompanyView = pathname.startsWith('/company');
  const isAdminView = pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col -space-y-1.5">
              <span className="text-2xl font-black text-primary tracking-tighter uppercase">BusBook</span>
              <span className="text-[9px] font-black tracking-[0.3em] text-accent">RWANDA</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {!isCompanyView && !isAdminView ? (
              <>
                <Link href="/" className="text-gray-600 hover:text-primary font-black transition-colors text-xs uppercase tracking-[0.2em]">
                  Home
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-primary font-black transition-colors text-xs uppercase tracking-[0.2em]">
                  Search
                </Link>
                <Link href="/tickets" className="text-gray-600 hover:text-primary font-black transition-colors flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <Ticket className="h-4 w-4 text-accent" />
                  My Trips
                </Link>
              </>
            ) : isCompanyView ? (
              <>
                <Link href="/company/dashboard" className="text-gray-600 hover:text-primary font-black transition-colors flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <LayoutDashboard className="h-4 w-4 text-accent" />
                  Dashboard
                </Link>
                <Link href="/company/trips/new" className="text-gray-600 hover:text-primary font-black transition-colors flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <PlusCircle className="h-4 w-4 text-accent" />
                  New Schedule
                </Link>
              </>
            ) : (
              <>
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary font-black transition-colors flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                   <ShieldCheck className="h-4 w-4 text-red-500" />
                   Infrastructure
                </Link>
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 border-2 border-gray-50 rounded-2xl font-black h-12 px-5 hover:bg-gray-50">
                  {user ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{user.displayName || 'Traveler'}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 rounded-[1.5rem] border-none shadow-2xl mt-2">
                {!user ? (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl p-4 cursor-pointer">
                      <Link href="/login" className="font-black text-center justify-center text-primary text-xs uppercase tracking-widest w-full">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl p-4 cursor-pointer mt-2 bg-gray-50">
                      <Link href="/register" className="font-black text-center justify-center text-xs uppercase tracking-widest w-full">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 px-4">Switch Perspective</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => switchRole('passenger')} className="rounded-xl p-4 cursor-pointer hover:bg-primary/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-xl"><User className="h-4 w-4 text-primary" /></div>
                        <span className="font-black text-sm uppercase">Passenger</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole('company')} className="rounded-xl p-4 cursor-pointer hover:bg-accent/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent/10 rounded-xl"><LayoutDashboard className="h-4 w-4 text-accent" /></div>
                        <span className="font-black text-sm uppercase">Bus Operator</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchRole('admin')} className="rounded-xl p-4 cursor-pointer hover:bg-red-50">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-100 rounded-xl"><ShieldCheck className="h-4 w-4 text-red-600" /></div>
                        <span className="font-black text-sm uppercase">Admin Panel</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-3 mx-2 bg-gray-100" />
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-4 cursor-pointer text-destructive font-black uppercase text-xs tracking-widest">
                      <LogOut className="h-4 w-4 mr-3" />
                      Log Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
             {/* Simple mobile menu implementation omitted for brevity, but would go here */}
             <Button variant="ghost" size="icon" className="rounded-xl"><Menu className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
