
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import { MOCK_ROUTES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bus, MapPin, Calendar, Clock, ChevronLeft, CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const route = MOCK_ROUTES.find(r => r.id === id);

  if (!route) return <div>Route not found</div>;

  const totalAmount = selectedSeats.length * route.price;
  const serviceFee = 200;

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Booking Successful!",
        description: `Your ticket for ${route.busName} has been confirmed. QR code generated.`,
      });
      router.push("/tickets");
    }, 2000);
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
                     <p className="text-3xl font-black text-primary">{route.price.toLocaleString()} RWF</p>
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
                       <p className="text-sm font-bold text-gray-700">{route.busPark}</p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <SeatMap onSeatsChange={setSelectedSeats} />

            <Card className="border-none shadow-sm overflow-hidden">
               <CardHeader className="bg-gray-50 border-b">
                 <CardTitle className="text-xl font-black">Payment Method</CardTitle>
               </CardHeader>
               <CardContent className="p-8">
                 <RadioGroup defaultValue="momo" onValueChange={setPaymentMethod} className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <RadioGroupItem value="momo" id="momo" className="sr-only" />
                      <Label 
                        htmlFor="momo" 
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all w-full",
                          paymentMethod === 'momo' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <Smartphone className={cn("h-8 w-8 mb-2", paymentMethod === 'momo' ? "text-primary" : "text-gray-400")} />
                        <span className="font-bold">MTN MoMo</span>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="airtel" id="airtel" className="sr-only" />
                      <Label 
                        htmlFor="airtel" 
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all w-full",
                          paymentMethod === 'airtel' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <Smartphone className={cn("h-8 w-8 mb-2", paymentMethod === 'airtel' ? "text-primary" : "text-gray-400")} />
                        <span className="font-bold">Airtel Money</span>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="card" id="card" className="sr-only" />
                      <Label 
                        htmlFor="card" 
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all w-full",
                          paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <CreditCard className={cn("h-8 w-8 mb-2", paymentMethod === 'card' ? "text-primary" : "text-gray-400")} />
                        <span className="font-bold">Debit Card</span>
                      </Label>
                    </div>
                 </RadioGroup>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg sticky top-24">
              <CardHeader className="bg-gray-50 rounded-t-2xl">
                <CardTitle className="text-xl font-black">Electronic Bill</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Base Fare x {selectedSeats.length || 0}</span>
                    <span>{(selectedSeats.length * route.price).toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Service Fee</span>
                    <span>{selectedSeats.length > 0 ? serviceFee.toLocaleString() : 0} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>VAT (Included)</span>
                    <span className="text-teal-600">0 RWF</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-primary">
                    {selectedSeats.length > 0 ? (totalAmount + serviceFee).toLocaleString() : 0} RWF
                  </span>
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
                  disabled={isProcessing || selectedSeats.length === 0}
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-white text-lg font-black gap-2 shadow-xl shadow-accent/20"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Smartphone className="h-5 w-5" />
                      Pay with {paymentMethod === 'momo' ? 'MoMo' : paymentMethod === 'airtel' ? 'Airtel' : 'Card'}
                    </>
                  )}
                </Button>
                
                <div className="flex items-center gap-2 justify-center text-gray-400">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  <p className="text-xs font-medium uppercase tracking-widest">Secure Payment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { cn } from "@/lib/utils";
