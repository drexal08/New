
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  
  // Create a 10x4 seat layout with a passage in the middle
  const seats: Seat[] = Array.from({ length: 40 }, (_, i) => ({
    id: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
    status: Math.random() > 0.8 ? 'occupied' : 'available'
  }));

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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8 flex justify-between items-center">
        <h4 className="font-bold text-lg text-gray-800">Choose your seat</h4>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gray-300" />
            <span>Occupied</span>
          </div>
        </div>
      </div>

      <div className="max-w-xs mx-auto">
        <div className="flex justify-end mb-8">
           <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-400 rotate-90">
             STEERING
           </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {seats.map((seat, index) => {
            const isSelected = selectedSeats.includes(seat.id);
            const isOccupied = seat.status === 'occupied';
            const isPassage = index % 4 === 2; // Create passage

            return (
              <div key={seat.id} className={cn(isPassage && "ml-4")}>
                <button
                  type="button"
                  disabled={isOccupied}
                  onClick={() => toggleSeat(seat.id, seat.status)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all transform hover:scale-105",
                    isOccupied ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 
                    isSelected ? "bg-primary text-white shadow-lg ring-2 ring-primary/20" : 
                    "bg-gray-50 border-2 border-gray-100 text-gray-600 hover:bg-primary/10 hover:border-primary/20"
                  )}
                >
                  {seat.id}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
