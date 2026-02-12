
"use client";

import Link from "next/link";
import { Bus, User, Ticket, Menu, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useUser, useAuth, initiateAnonymousSignIn } from "@/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [role, setRole] = useState<'passenger' | 'company'>('passenger');

  const handleSignIn = () => {
    initiateAnonymousSignIn(auth);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black text-primary tracking-tighter uppercase">Bus Booking</span>
              <span className="text-[8px] font-black tracking-[0.2em] text-accent">RWANDA</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-wider">
              Search
            </Link>
            <Link href="/tickets" className="text-gray-600 hover:text-primary font-bold transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
              <Ticket className="h-4 w-4" />
              My Bookings
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-2 border-gray-100 rounded-xl font-bold">
                  {user ? (
                    <>
                      <User className="h-4 w-4 text-primary" />
                      {role === 'passenger' ? 'Passenger' : 'Company'}
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl">
                {!user ? (
                  <DropdownMenuItem onClick={handleSignIn} className="rounded-xl p-3 cursor-pointer text-primary font-black uppercase text-xs tracking-widest text-center justify-center">
                    Quick Sign In (Guest)
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-gray-400 mb-2">Account Management</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setRole('passenger')} className="rounded-xl p-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg"><User className="h-4 w-4 text-primary" /></div>
                        <span className="font-bold">Passenger Account</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRole('company')} className="rounded-xl p-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg"><LayoutDashboard className="h-4 w-4 text-accent" /></div>
                        <span className="font-bold">Company Dashboard</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-3 cursor-pointer text-destructive font-bold">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl">
                <DropdownMenuItem asChild className="rounded-xl p-3">
                  <Link href="/" className="font-bold">Search</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-3">
                  <Link href="/tickets" className="font-bold">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!user ? (
                   <DropdownMenuItem onClick={handleSignIn} className="rounded-xl p-3 font-black uppercase text-xs tracking-widest text-primary">
                     Sign In
                   </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-xl p-3 font-black uppercase text-xs tracking-widest text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
