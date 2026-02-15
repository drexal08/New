
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import { useDoc, useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="font-black text-gray-500 uppercase tracking-widest text-xs">Authenticating Checkout...</p>
      </div>
    );
  }

  if (!trip) return <div className="p-20 text-center font-bold">Trip not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <Link href="/search" className="inline-flex items-center text-primary font-black mb-12 hover:gap-3 transition-all text-xs uppercase tracking-widest">
          <ChevronLeft className="h-5 w-5" /> Cancel & Back to Search
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="p-10 lg:p-14">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div className="flex items-center gap-6">
                     <div className="bg-primary p-6 rounded-[2rem] shadow-xl shadow-primary/20">
                       <Bus className="h-10 w-10 text-white" />
                     </div>
                     <div>
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">{trip.busName}</h2>
                       <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">
                            {trip.registrationNumber || "Plate Pending"}
                          </Badge>
                          <p className="text-accent font-black text-xs uppercase tracking-[0.2em]">{trip.status}</p>
                       </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Fare per Seat</p>
                     <p className="text-4xl font-black text-primary">{trip.price?.toLocaleString()} <span className="text-sm font-medium">RWF</span></p>
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <Calendar className="h-5 w-5 text-primary" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Travel Date</p>
                       <p className="text-sm font-black text-gray-800">{format(new Date(trip.departureTime), "EEEE, MMM dd")}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <Clock className="h-5 w-5 text-primary" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure</p>
                       <p className="text-sm font-black text-gray-800">{format(new Date(trip.departureTime), "HH:mm")}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <MapPin className="h-5 w-5 text-accent" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Park Terminal</p>
                       <p className="text-sm font-black text-gray-800 truncate">{trip.originBusParkId}</p>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <SeatMap onSeatsChange={setSelectedSeats} />

            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
               <CardHeader className="bg-gray-50/50 p-10 border-b border-gray-100">
                 <CardTitle className="text-2xl font-black flex items-center gap-3">
                   Secure Checkout <ShieldCheck className="h-6 w-6 text-teal-500" />
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-10 lg:p-14">
                 <RadioGroup defaultValue="momo" onValueChange={setPaymentMethod} className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <RadioGroupItem value="momo" id="momo" className="sr-only" />
                      <Label 
                        htmlFor="momo" 
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 cursor-pointer transition-all w-full h-full",
                          paymentMethod === 'momo' ? "border-primary bg-primary/5" : "border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="bg-yellow-400 p-3 rounded-xl mb-4 shadow-md"><Smartphone className="h-8 w-8 text-white" /></div>
                        <span className="font-black text-sm uppercase tracking-widest">MTN MoMo</span>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="airtel" id="airtel" className="sr-only" />
                      <Label 
                        htmlFor="airtel" 
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 cursor-pointer transition-all w-full h-full",
                          paymentMethod === 'airtel' ? "border-primary bg-primary/5" : "border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="bg-red-600 p-3 rounded-xl mb-4 shadow-md"><Smartphone className="h-8 w-8 text-white" /></div>
                        <span className="font-black text-sm uppercase tracking-widest">Airtel Money</span>
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="card" id="card" className="sr-only" />
                      <Label 
                        htmlFor="card" 
                        className={cn(
                          "flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 cursor-pointer transition-all w-full h-full",
                          paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-md"><CreditCard className="h-8 w-8 text-white" /></div>
                        <span className="font-black text-sm uppercase tracking-widest">Visa / Card</span>
                      </Label>
                    </div>
                 </RadioGroup>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="border-none shadow-2xl rounded-[3rem] sticky top-24 bg-white overflow-hidden">
              <CardHeader className="bg-primary text-white p-10">
                <CardTitle className="text-2xl font-black">Trip Summary</CardTitle>
                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Electronic Receipt</p>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-gray-500 font-bold text-sm uppercase tracking-widest">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span className="text-gray-900">{(selectedSeats.length * (trip.price || 0)).toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-bold text-sm uppercase tracking-widest">
                    <span>Service Fee</span>
                    <span className="text-gray-900">{serviceFee.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between items-center text-teal-600 font-black text-sm uppercase tracking-widest">
                    <span>VAT (18% Incl.)</span>
                    <span>-</span>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 uppercase">Total</span>
                  <span className="text-3xl font-black text-primary">
                    {(totalAmount + serviceFee).toLocaleString()} RWF
                  </span>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Allocated Seats</p>
                    <div className="flex flex-wrap gap-2">
                       {selectedSeats.map(seat => (
                         <span key={seat} className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full">{seat}</span>
                       ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={isProcessing || selectedSeats.length === 0}
                  className="w-full h-16 bg-accent hover:bg-accent/90 text-white text-xl font-black rounded-[1.5rem] gap-3 shadow-2xl shadow-accent/20 active:scale-95 transition-all"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-6 w-6" />
                      PAY NOW
                    </>
                  )}
                </Button>
                
                <div className="text-center space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secured by BusBook Gate</p>
                   <div className="flex justify-center gap-4 opacity-30 grayscale">
                      <div className="w-8 h-4 bg-gray-400 rounded-sm" />
                      <div className="w-8 h-4 bg-gray-400 rounded-sm" />
                      <div className="w-8 h-4 bg-gray-400 rounded-sm" />
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
