
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import { MOCK_ROUTES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bus, MapPin, Calendar, Clock, ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const route = MOCK_ROUTES.find(r => r.id === id);

  if (!route) return <div>Route not found</div>;

  const totalAmount = selectedSeats.length * route.price;

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be a server action
    toast({
      title: "Booking Successful!",
      description: `Your booking for ${selectedSeats.length} seat(s) has been confirmed.`,
    });
    router.push("/tickets");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/search" className="inline-flex items-center text-primary font-bold mb-8 hover:gap-2 transition-all">
          <ChevronLeft className="h-5 w-5" /> Back to Search
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                   <div className="flex items-center gap-4">
                     <div className="bg-primary/10 p-4 rounded-2xl">
                       <Bus className="h-8 w-8 text-primary" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-black text-gray-900">{route.busName}</h2>
                       <p className="text-gray-500 font-medium">{route.type} • {route.origin} to {route.destination}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Fare per seat</p>
                     <p className="text-3xl font-black text-primary">${route.price}</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 bg-gray-50 p-6 rounded-2xl">
                   <div className="flex items-center gap-3">
                     <Calendar className="h-5 w-5 text-gray-400" />
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Date</p>
                       <p className="text-sm font-bold text-gray-700">Oct 24, 2023</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Clock className="h-5 w-5 text-gray-400" />
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Departure</p>
                       <p className="text-sm font-bold text-gray-700">{route.departureTime}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <MapPin className="h-5 w-5 text-gray-400" />
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Pickup Point</p>
                       <p className="text-sm font-bold text-gray-700">Central Station Gate 4</p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <SeatMap onSeatsChange={setSelectedSeats} />
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg sticky top-24">
              <CardHeader className="bg-gray-50 rounded-t-2xl">
                <CardTitle className="text-xl font-black">Fare Details</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Base Fare x {selectedSeats.length || 0}</span>
                    <span>${totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Service Fee</span>
                    <span>$2.00</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Insurance</span>
                    <span className="text-teal-600">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-black text-primary">${selectedSeats.length > 0 ? totalAmount + 2 : 0}</span>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-xs font-bold text-primary uppercase mb-2">Selected Seats</p>
                    <div className="flex flex-wrap gap-2">
                       {selectedSeats.map(seat => (
                         <span key={seat} className="bg-primary text-white text-xs font-black px-3 py-1 rounded-full">{seat}</span>
                       ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-white text-lg font-black gap-2 shadow-xl shadow-accent/20"
                >
                  <CreditCard className="h-5 w-5" />
                  Proceed to Payment
                </Button>
                
                <p className="text-center text-xs text-gray-400 font-medium">
                  By clicking proceed, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
