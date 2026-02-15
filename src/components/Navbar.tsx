
"use client";

import Link from "next/link";
import { Bus, User, Ticket, Menu, LayoutDashboard, LogIn, LogOut, PlusCircle, ShieldCheck, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { doc } from "firebase/firestore";

export default function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const pathname = usePathname();
  const router = useRouter();
  
  // Fetch user profile to get fixed role
  const profileRef = useMemoFirebase(() => user ? doc(firestore, "user_profiles", user.uid) : null, [firestore, user]);
  const { data: profile } = useDoc(profileRef);

  // SECURE ADMIN CHECK: Check for specific admin email
  const isAdmin = user?.email === 'byiringirinnocent8@gmail.com';
  const isOperator = profile?.role === 'company' && !isAdmin;
  const isPassenger = profile?.role === 'passenger' && !isAdmin;

  const handleSignOut = () => {
    signOut(auth);
    router.push("/");
  };

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
            {/* Passenger Links */}
            {!isOperator && !isAdmin && (
              <>
                <Link href="/" className="text-gray-600 hover:text-primary font-black transition-colors text-xs uppercase tracking-[0.2em]">
                  Home
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-primary font-black transition-colors text-xs uppercase tracking-[0.2em]">
                  Search
                </Link>
                {user && (
                  <Link href="/tickets" className="text-gray-600 hover:text-primary font-black transition-colors flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                    <Ticket className="h-4 w-4 text-accent" />
                    My Trips
                  </Link>
                )}
              </>
            )}

            {/* Operator Links */}
            {isOperator && !isAdmin && (
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
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary font-black transition-colors flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                   <ShieldCheck className="h-4 w-4 text-red-500" />
                   System Admin
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
                      <span className="text-sm max-w-[100px] truncate">{profile?.firstName || user.displayName || 'Account'}</span>
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
                    <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 px-4">Account Type</DropdownMenuLabel>
                    <div className="px-4 py-2 mb-2 bg-gray-50 rounded-xl flex items-center gap-3">
                      {isAdmin ? <ShieldCheck className="h-4 w-4 text-red-500" /> : isOperator ? <Bus className="h-4 w-4 text-accent" /> : <UserCircle className="h-4 w-4 text-primary" />}
                      <span className="text-xs font-black uppercase tracking-widest text-gray-700">
                        {isAdmin ? 'System Admin' : isOperator ? 'Operator' : 'Passenger'}
                      </span>
                    </div>
                    
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
             <Button variant="ghost" size="icon" className="rounded-xl"><Menu className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
