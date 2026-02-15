"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import { useDoc, useFirestore, useUser, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bus, MapPin, Calendar, Clock, ChevronLeft, CreditCard, Smartphone, CheckCircle2, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const tripRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, "trips", id as string);
  }, [firestore, id]);

  const { data: trip, isLoading } = useDoc(tripRef);

  const totalAmount = selectedSeats.length * (trip?.price || 0);
  const serviceFee = selectedSeats.length > 0 ? 350 : 0;

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Auth Required",
        description: "Please sign in to confirm your booking.",
      });
      router.push("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Using setTimeout to simulate payment processing time
    setTimeout(() => {
      const bookingData = {
        userId: user.uid,
        tripId: id as string,
        busName: trip?.busName || "Standard Trip",
        registrationNumber: trip?.registrationNumber || "Plate Pending",
        bookedSeatNumbers: selectedSeats,
        bookingDate: trip?.departureTime || new Date().toISOString(),
        totalPrice: totalAmount + serviceFee,
        status: "Confirmed",
        paymentMethod: paymentMethod,
        qrCodeData: `BB-RW-${id}-${user.uid.substring(0,5)}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        originBusParkId: trip?.originBusParkId || "Terminal",
        destinationBusParkId: trip?.destinationBusParkId || "Arrival"
      };

      const userBookingsRef = collection(firestore, "user_profiles", user.uid, "bookings");
      
      // Initiate the write and redirect optimistically
      addDocumentNonBlocking(userBookingsRef, bookingData);

      toast({
        title: "Booking Initiated",
        description: `Your ticket for ${trip?.busName} is being generated.`,
      });
      
      router.push("/tickets");
    }, 1500);
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-semibold text-muted-foreground text-[10px] uppercase tracking-widest">Verifying Checkout...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 max-w-lg mx-auto">
             <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <MapPin className="h-8 w-8 text-red-500/50" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
             <p className="text-muted-foreground mb-8">This schedule might have changed or expired.</p>
             <Button asChild className="rounded-xl h-12 px-8">
               <Link href="/search">Back to Search</Link>
             </Button>
          </div>
        </div>
      </div>
    );
  }

  const departureDate = trip.departureTime ? new Date(trip.departureTime) : new Date();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4">
        <Link href="/search" className="inline-flex items-center text-primary font-bold mb-8 hover:underline text-xs uppercase tracking-widest group">
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Search
        </Link>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div className="flex items-center gap-6">
                     <div className="bg-primary p-5 rounded-2xl shadow-xl shadow-primary/10">
                       <Bus className="h-8 w-8 text-white" />
                     </div>
                     <div>
                       <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{trip.busName}</h2>
                       <div className="flex gap-2 mt-1 items-center">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary px-3">
                            {trip.registrationNumber || "Plate Pending"}
                          </Badge>
                          <Badge className="bg-accent text-white border-none font-bold text-[9px] uppercase tracking-widest px-3">{trip.status}</Badge>
                       </div>
                     </div>
                   </div>
                   <div className="md:text-right">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Fare per Seat</p>
                     <p className="text-4xl font-bold text-primary tracking-tight">{trip.price?.toLocaleString()} <span className="text-sm font-medium ml-0.5">RWF</span></p>
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-4">
                     <Calendar className="h-5 w-5 text-primary" />
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Travel Date</p>
                       <p className="text-sm font-bold text-gray-900">{format(departureDate, "MMM dd, yyyy")}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <Clock className="h-5 w-5 text-primary" />
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Departure</p>
                       <p className="text-sm font-bold text-gray-900">{format(departureDate, "HH:mm")}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <MapPin className="h-5 w-5 text-accent" />
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Terminal</p>
                       <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{trip.originBusParkId}</p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <SeatMap onSeatsChange={setSelectedSeats} />

            <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
               <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                 <CardTitle className="text-xl font-bold flex items-center gap-3">
                   Secure Payment <ShieldCheck className="h-5 w-5 text-accent" />
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-8 md:p-12">
                 <RadioGroup defaultValue="momo" onValueChange={setPaymentMethod} className="grid md:grid-cols-3 gap-6">
                    <div>
                      <RadioGroupItem value="momo" id="momo" className="sr-only" />
                      <Label 
                        htmlFor="momo" 
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50",
                          paymentMethod === 'momo' ? "border-primary bg-primary/5" : "border-gray-100"
                        )}
                      >
                        <Smartphone className="h-8 w-8 text-yellow-500 mb-3" />
                        <span className="font-bold text-xs uppercase tracking-widest">MTN MoMo</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="airtel" id="airtel" className="sr-only" />
                      <Label 
                        htmlFor="airtel" 
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50",
                          paymentMethod === 'airtel' ? "border-primary bg-primary/5" : "border-gray-100"
                        )}
                      >
                        <Smartphone className="h-8 w-8 text-red-600 mb-3" />
                        <span className="font-bold text-xs uppercase tracking-widest">Airtel Money</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="card" id="card" className="sr-only" />
                      <Label 
                        htmlFor="card" 
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50",
                          paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-gray-100"
                        )}
                      >
                        <CreditCard className="h-8 w-8 text-blue-600 mb-3" />
                        <span className="font-bold text-xs uppercase tracking-widest">Visa / Card</span>
                      </Label>
                    </div>
                 </RadioGroup>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="border-none shadow-2xl rounded-2xl sticky top-24 bg-white overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle className="text-xl font-bold">Trip Summary</CardTitle>
                <p className="text-white/70 font-bold uppercase tracking-widest text-[9px] mt-1">Order Details</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span className="text-gray-900 text-sm">{(selectedSeats.length * (trip.price || 0)).toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                    <span>Service Fee</span>
                    <span className="text-gray-900 text-sm">{serviceFee.toLocaleString()} RWF</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary tracking-tight">
                      {(totalAmount + serviceFee).toLocaleString()}
                    </span>
                    <span className="text-xs font-medium ml-0.5 text-primary">RWF</span>
                  </div>
                </div>

                {selectedSeats.length > 0 ? (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Selected Seats</p>
                    <div className="flex flex-wrap gap-2">
                       {selectedSeats.map(seat => (
                         <span key={seat} className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-lg">{seat}</span>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center flex flex-col items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-gray-300" />
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Select your seats to continue</p>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={isProcessing || selectedSeats.length === 0}
                  className="w-full h-16 bg-accent hover:bg-accent/90 text-white text-lg font-bold rounded-xl gap-2 shadow-lg transition-all active:scale-95"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Book Now
                    </>
                  )}
                </Button>
                
                <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-4">
                  Secured by BusBook Pay
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
