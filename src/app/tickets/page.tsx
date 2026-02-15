
"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Calendar, Clock, Download, ChevronRight, QrCode, Loader2, AlertCircle, Phone, Mail, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function MyTickets() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "user_profiles", user.uid, "bookings"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: bookings, isLoading: isBookingsLoading } = useCollection(bookingsQuery);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 print:hidden flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">My Rwandan Trips</h1>
            <p className="text-gray-500 font-medium">Digital tickets and electronic bills for your journeys.</p>
          </div>
          <Button onClick={handlePrint} variant="outline" className="rounded-xl font-bold gap-2">
            <Printer className="h-4 w-4" /> Print All
          </Button>
        </div>

        {!user && !isAuthLoading ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center print:hidden">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">Sign in to view bookings</h3>
            <p className="text-gray-500 mb-8">Please log in to your account to see your travel history and tickets.</p>
          </div>
        ) : isBookingsLoading || isAuthLoading ? (
          <div className="flex flex-col items-center justify-center py-20 print:hidden">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="font-bold text-gray-500">Retrieving your tickets...</p>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-12">
            {bookings.map((ticket) => (
              <Card key={ticket.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white rounded-3xl print:shadow-none print:border print:rounded-none">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-grow">
                      {/* Header Section */}
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-4">
                           <div className="bg-primary/10 p-4 rounded-2xl">
                              <Bus className="h-8 w-8 text-primary" />
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                {ticket.busName || "Standard Trip"}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary">
                                  {ticket.registrationNumber || "PLATE PENDING"}
                                </Badge>
                                <Badge className="bg-teal-500 text-white border-none text-[10px]">
                                  {ticket.status}
                                </Badge>
                              </div>
                           </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">E-BILL NO</p>
                            <p className="font-black text-gray-900">{ticket.id.substring(0,10).toUpperCase()}</p>
                         </div>
                      </div>

                      <Separator className="mb-8 opacity-50" />

                      {/* Travel Details */}
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                         <div className="space-y-4">
                            <div className="flex items-start gap-3">
                               <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                               <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Route & Park</p>
                                  <p className="text-sm font-bold text-gray-800">Origin: {ticket.originBusParkId || "Terminal"}</p>
                                  <p className="text-sm font-bold text-gray-800">Dest: {ticket.destinationBusParkId || "Arrival"}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <Calendar className="h-5 w-5 text-primary" />
                               <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Date</p>
                                  <p className="text-sm font-bold text-gray-800">
                                    {ticket.bookingDate ? format(new Date(ticket.bookingDate), "EEEE, MMM dd, yyyy") : "TBA"}
                                  </p>
                               </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <Clock className="h-5 w-5 text-primary" />
                               <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Boarding Time</p>
                                  <p className="text-sm font-bold text-gray-800">
                                    {ticket.bookingDate ? format(new Date(ticket.bookingDate), "HH:mm") : "TBA"}
                                  </p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <ShieldCheck className="h-5 w-5 text-teal-600" />
                               <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Seats</p>
                                  <p className="text-sm font-bold text-gray-800">{ticket.bookedSeatNumbers?.join(', ')}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <Separator className="mb-8 opacity-50" />

                      {/* Company Info - For the Bill */}
                      <div className="bg-gray-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 print:bg-white print:border">
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Transport Provider</p>
                            <p className="text-sm font-black text-gray-900 uppercase">{ticket.busName}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Kigali Heights, 4th Floor, Rwanda</p>
                         </div>
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                               <Phone className="h-3 w-3 text-primary" />
                               <span>+250 788 000 000</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                               <Mail className="h-3 w-3 text-primary" />
                               <span>contact@{ticket.busName?.toLowerCase().replace(/\s+/g, '')}.rw</span>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* QR & Total Section */}
                    <div className="bg-gray-50 p-10 flex flex-col items-center justify-center md:border-l border-gray-200 min-w-[280px] print:bg-white">
                       <div className="bg-white p-5 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-8 print:shadow-none print:border-2">
                          <QrCode className="h-32 w-32 text-gray-900" />
                          <div className="mt-3 text-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary">SCAN TO VERIFY</p>
                             <p className="text-[8px] text-gray-400 mt-1">BusBook QR Verification System</p>
                          </div>
                       </div>
                       
                       <div className="text-center w-full mb-8">
                          <div className="flex justify-between items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                             <span>Subtotal</span>
                             <span>{ticket.totalPrice?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                             <span>VAT (18%)</span>
                             <span>Included</span>
                          </div>
                          <Separator className="mb-4" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                          <p className="text-4xl font-black text-primary">{ticket.totalPrice?.toLocaleString()} <span className="text-xs">RWF</span></p>
                       </div>

                       <div className="flex flex-col w-full gap-3 print:hidden">
                          <Button variant="outline" className="w-full gap-2 border-primary text-primary font-black hover:bg-primary hover:text-white rounded-2xl h-12">
                             <Download className="h-4 w-4" /> E-BILL PDF
                          </Button>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center">
            <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-8">You haven't booked any tickets yet. Ready for your next trip?</p>
            <Button asChild className="rounded-full px-10">
              <Link href="/">Find a Bus</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
