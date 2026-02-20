
"use client";

import Link from "next/link";
import { Bus, User, Ticket, Menu, LayoutDashboard, LogIn, LogOut, PlusCircle, ShieldCheck, UserCircle, Building2 } from "lucide-react";
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
  
  const profileRef = useMemoFirebase(() => user ? doc(firestore, "user_profiles", user.uid) : null, [firestore, user]);
  const { data: profile } = useDoc(profileRef);

  const ADMIN_EMAIL = 'byiringirinnocent8@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  const isCompany = profile?.role === 'COMPANY';
  const isOperator = profile?.role === 'company' || isCompany || isAdmin;
  const isPassenger = profile?.role === 'passenger' || isAdmin;

  const handleSignOut = () => {
    signOut(auth);
    router.push("/");
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : (user?.displayName || (isAdmin ? 'System Admin' : 'Traveler'));

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-primary/20">
              <Bus className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl md:text-2xl font-bold text-primary tracking-tight uppercase">BusBook</span>
              <span className="text-[8px] font-bold tracking-[0.4em] text-accent">RWANDA</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary font-bold transition-all text-[11px] uppercase tracking-widest">
              Home
            </Link>
            
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-red-600 font-bold transition-all flex items-center gap-2 text-[11px] uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-red-500" />
                 Admin
              </Link>
            )}

            {user && (
              <>
                {isPassenger && (
                  <Link href="/tickets" className="text-gray-600 hover:text-primary font-bold transition-all flex items-center gap-2 text-[11px] uppercase tracking-widest">
                    <Ticket className="h-4 w-4 text-accent" />
                    Tickets
                  </Link>
                )}
                {isOperator && (
                  <>
                    <Link href="/company/dashboard" className="text-gray-600 hover:text-primary font-bold transition-all flex items-center gap-2 text-[11px] uppercase tracking-widest">
                      <LayoutDashboard className="h-4 w-4 text-accent" />
                      Dash
                    </Link>
                    <Link href="/company/trips/new" className="text-gray-600 hover:text-primary font-bold transition-all flex items-center gap-2 text-[11px] uppercase tracking-widest">
                      <PlusCircle className="h-4 w-4 text-accent" />
                      Post
                    </Link>
                  </>
                )}
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 border border-gray-100 rounded-xl font-bold h-10 px-4 hover:bg-gray-50 transition-all">
                  {user ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm max-w-[120px] truncate">{fullName}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 rounded-xl border border-gray-100 shadow-xl mt-2">
                {!user ? (
                  <>
                    <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                      <Link href="/login" className="font-bold text-center justify-center text-primary text-xs uppercase tracking-widest w-full">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer mt-1 bg-gray-50">
                      <Link href="/register" className="font-bold text-center justify-center text-xs uppercase tracking-widest w-full">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="font-bold text-[9px] uppercase tracking-[0.2em] text-gray-400 px-3 py-2">Role: {isAdmin ? 'Admin' : profile?.role === 'COMPANY' ? 'Company Owner' : profile?.role === 'company' ? 'Operator' : 'Passenger'}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-lg p-3 cursor-pointer text-destructive font-bold uppercase text-[10px] tracking-widest">
                      <LogOut className="h-3.5 w-3.5 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
             <Button variant="ghost" size="icon" className="rounded-lg"><Menu className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
