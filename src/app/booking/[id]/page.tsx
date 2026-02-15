"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import { useDoc, useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bus, MapPin, Calendar, Clock, ChevronLeft, CreditCard, Smartphone, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
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
  
  const tripRef = id ? doc(firestore, "trips", id as string) : null;
  const { data: trip, isLoading } = useDoc(tripRef);

  const totalAmount = selectedSeats.length * (trip?.price || 0);
  const serviceFee = selectedSeats.length > 0 ? 350 : 0;

  const handleBooking = async () => {
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
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const bookingData = {
          userId: user.uid,
          tripId: id as string,
          busName: trip?.busName,
          registrationNumber: trip?.registrationNumber,
          bookedSeatNumbers: selectedSeats,
          bookingDate: trip?.departureTime || new Date().toISOString(),
          totalPrice: totalAmount + serviceFee,
          status: "Confirmed",
          paymentMethod: paymentMethod,
          qrCodeData: `BB-RW-${id}-${user.uid.substring(0,5)}-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          originBusParkId: trip?.originBusParkId,
          destinationBusParkId: trip?.destinationBusParkId
        };

        const userBookingsRef = collection(firestore, "user_profiles", user.uid, "bookings");
        await addDocumentNonBlocking(userBookingsRef, bookingData);

        toast({
          title: "Payment Successful!",
          description: `Confirmed! Your electronic ticket has been generated.`,
        });
        
        router.push("/tickets");
      } catch (e: any) {
        toast({
          title: "Checkout Error",
          description: "There was an issue processing your booking.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
        <p className="font-black text-gray-400 uppercase tracking-[0.3em] text-xs">Authenticating Checkout...</p>
      </div>
    );
  }

  if (!trip) return <div className="p-24 text-center font-black text-2xl text-gray-300">Trip schedule not found</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link href="/search" className="inline-flex items-center text-primary font-black mb-12 hover:gap-4 transition-all text-sm uppercase tracking-widest group">
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Cancel & Back to Search
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white animate-in slide-in-from-left-8 duration-700">
              <CardContent className="p-12 lg:p-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
                   <div className="flex items-center gap-8">
                     <div className="bg-primary p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20">
                       <Bus className="h-12 w-12 text-white" />
                     </div>
                     <div>
                       <h2 className="text-4xl font-black text-gray-900 tracking-tight">{trip.busName}</h2>
                       <div className="flex gap-3 mt-2">
                          <Badge variant="outline" className="text-[10px] font-black tracking-widest border-primary/20 text-primary px-4">
                            {trip.registrationNumber || "Plate Pending"}
                          </Badge>
                          <Badge className="bg-accent text-white border-none font-black text-[10px] uppercase tracking-widest px-4">{trip.status}</Badge>
                       </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Fare per Seat</p>
                     <p className="text-5xl font-black text-primary tracking-tighter">{trip.price?.toLocaleString()} <span className="text-lg font-bold ml-1">RWF</span></p>
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12 bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                   <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <Calendar className="h-6 w-6 text-primary" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Travel Date</p>
                       <p className="text-base font-black text-gray-900">{format(new Date(trip.departureTime), "EEEE, MMM dd")}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <Clock className="h-6 w-6 text-primary" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Departure</p>
                       <p className="text-base font-black text-gray-900">{format(new Date(trip.departureTime), "HH:mm")}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <MapPin className="h-6 w-6 text-accent" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Terminal</p>
                       <p className="text-base font-black text-gray-900 truncate">{trip.originBusParkId}</p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="animate-in slide-in-from-left-12 duration-700 delay-100">
              <SeatMap onSeatsChange={setSelectedSeats} />
            </div>

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white animate-in slide-in-from-left-16 duration-700 delay-200">
               <CardHeader className="bg-gray-50/50 p-12 border-b border-gray-100">
                 <CardTitle className="text-3xl font-black flex items-center gap-4 tracking-tight">
                   Secure Payment <ShieldCheck className="h-8 w-8 text-accent animate-pulse" />
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-12 lg:p-16">
                 <RadioGroup defaultValue="momo" onValueChange={setPaymentMethod} className="grid md:grid-cols-3 gap-8">
                    <div className="flex items-center">
                      <RadioGroupItem value="momo" id="momo" className="sr-only" />
                      <Label 
                        htmlFor="momo" 
                        className={cn(
                          "flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all w-full h-full hover:scale-105",
                          paymentMethod === 'momo' ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="bg-yellow-400 p-5 rounded-3xl mb-6 shadow-xl shadow-yellow-400/20"><Smartphone className="h-10 w-10 text-white" /></div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-gray-700">MTN MoMo</span>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="airtel" id="airtel" className="sr-only" />
                      <Label 
                        htmlFor="airtel" 
                        className={cn(
                          "flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all w-full h-full hover:scale-105",
                          paymentMethod === 'airtel' ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="bg-red-600 p-5 rounded-3xl mb-6 shadow-xl shadow-red-600/20"><Smartphone className="h-10 w-10 text-white" /></div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-gray-700">Airtel Money</span>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="card" id="card" className="sr-only" />
                      <Label 
                        htmlFor="card" 
                        className={cn(
                          "flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all w-full h-full hover:scale-105",
                          paymentMethod === 'card' ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="bg-blue-600 p-5 rounded-3xl mb-6 shadow-xl shadow-blue-600/20"><CreditCard className="h-10 w-10 text-white" /></div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-gray-700">Visa / Card</span>
                      </Label>
                    </div>
                 </RadioGroup>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[3rem] sticky top-28 bg-white overflow-hidden animate-in slide-in-from-right-8 duration-700">
              <CardHeader className="bg-primary text-white p-12">
                <CardTitle className="text-3xl font-black tracking-tight">Trip Summary</CardTitle>
                <p className="text-white/70 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Electronic Bill</p>
              </CardHeader>
              <CardContent className="p-12 space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-gray-400 font-black text-xs uppercase tracking-widest">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span className="text-gray-900 text-base">{(selectedSeats.length * (trip.price || 0)).toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 font-black text-xs uppercase tracking-widest">
                    <span>Service Fee</span>
                    <span className="text-gray-900 text-base">{serviceFee.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-accent font-black text-xs uppercase tracking-[0.2em] bg-accent/5 p-4 rounded-2xl">
                    <span>VAT (18% Incl.)</span>
                    <span>PAID</span>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="flex justify-between items-end">
                  <span className="text-lg font-black text-gray-900 uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-primary tracking-tighter">
                      {(totalAmount + serviceFee).toLocaleString()}
                    </span>
                    <span className="text-sm font-bold ml-1 text-primary">RWF</span>
                  </div>
                </div>

                {selectedSeats.length > 0 ? (
                  <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 animate-in zoom-in duration-300">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Allocated Seats</p>
                    <div className="flex flex-wrap gap-3">
                       {selectedSeats.map(seat => (
                         <span key={seat} className="bg-primary text-white text-xs font-black px-5 py-2 rounded-2xl shadow-lg shadow-primary/20">{seat}</span>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No seats selected</p>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={isProcessing || selectedSeats.length === 0}
                  className="w-full h-20 bg-accent hover:bg-accent/90 text-white text-2xl font-black rounded-[1.5rem] gap-4 shadow-2xl shadow-accent/20 active:scale-95 transition-all"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin h-8 w-8" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-8 w-8" />
                      PAY NOW
                    </>
                  )}
                </Button>
                
                <div className="text-center space-y-4 pt-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Secured by BusBook Pay</p>
                   <div className="flex justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <div className="w-10 h-6 bg-gray-200 rounded-md" />
                      <div className="w-10 h-6 bg-gray-200 rounded-md" />
                      <div className="w-10 h-6 bg-gray-200 rounded-md" />
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
