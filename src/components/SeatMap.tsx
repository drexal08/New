"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SeatStatus = 'available' | 'selected' | 'occupied';

interface Seat {
  id: string;
  status: SeatStatus;
}

export default function SeatMap({ 
  onSeatsChange 
}: { 
  onSeatsChange: (seats: string[]) => void 
}) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isSoldOut, setIsSoldOut] = useState(false);
  
  useEffect(() => {
    // Generate seats on the client to avoid hydration mismatch
    // In a real app, this would come from the trip document's bookedSeats
    const generatedSeats: Seat[] = Array.from({ length: 40 }, (_, i) => ({
      id: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
      status: Math.random() > 0.9 ? 'occupied' : 'available' // Simulated occupancy
    }));
    
    setSeats(generatedSeats);
    setIsSoldOut(generatedSeats.every(s => s.status === 'occupied'));
  }, []);

  const toggleSeat = (seatId: string, status: SeatStatus) => {
    if (status === 'occupied') return;

    let newSelected: string[];
    if (selectedSeats.includes(seatId)) {
      newSelected = selectedSeats.filter(id => id !== seatId);
    } else {
      if (selectedSeats.length >= 6) return; // Limit seats per booking
      newSelected = [...selectedSeats, seatId];
    }
    
    setSelectedSeats(newSelected);
    onSeatsChange(newSelected);
  };

  if (seats.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400 font-medium animate-pulse">Loading Seat Map...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-xl text-gray-900">Choose your seat</h4>
          <p className="text-sm text-muted-foreground">Select up to 6 seats for this journey.</p>
        </div>
        <div className="flex gap-4 text-xs font-medium bg-gray-50 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary shadow-sm" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-300" />
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {isSoldOut ? (
        <Alert variant="destructive" className="rounded-2xl border-none bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="font-bold text-red-600">Bus Fully Booked</AlertTitle>
          <AlertDescription className="text-red-600/80">
            Sorry, all seats for this trip have been sold out. Please look for another schedule.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="max-w-xs mx-auto">
          <div className="flex justify-end mb-8">
             <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-400 rotate-90 border border-gray-200">
               STEER
             </div>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {seats.map((seat, index) => {
              const isSelected = selectedSeats.includes(seat.id);
              const isOccupied = seat.status === 'occupied';
              const isPassage = index % 4 === 2; // Create passage visual

              return (
                <div key={seat.id} className={cn(isPassage && "ml-4 md:ml-6")}>
                  <button
                    type="button"
                    disabled={isOccupied}
                    onClick={() => toggleSeat(seat.id, seat.status)}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all transform active:scale-90",
                      isOccupied ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300" : 
                      isSelected ? "bg-primary text-white shadow-lg ring-4 ring-primary/10 border border-primary" : 
                      "bg-white border-2 border-gray-100 text-gray-600 hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    {seat.id}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
              Seat availability is updated in real-time. Occupied seats (gray) cannot be selected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}