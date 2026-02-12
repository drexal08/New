
"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Calendar, Clock, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyTickets() {
  const mockTickets = [
    {
      id: "EZ-98234",
      busName: "Greyhound Express",
      from: "New York",
      to: "Washington DC",
      date: "Oct 24, 2023",
      time: "08:00 AM",
      seats: ["12A", "12B"],
      status: "Confirmed",
      amount: 92.00
    },
    {
      id: "EZ-12344",
      busName: "MegaBus Silver",
      from: "Boston",
      to: "New York",
      date: "Oct 15, 2023",
      time: "10:30 AM",
      seats: ["04C"],
      status: "Completed",
      amount: 47.00
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500 font-medium">View and manage your upcoming and past trips.</p>
        </div>

        <div className="space-y-6">
          {mockTickets.map((ticket) => (
            <Card key={ticket.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-8">
                       <div className="flex items-center gap-3">
                         <div className="bg-primary/10 p-3 rounded-xl">
                            <Bus className="h-6 w-6 text-primary" />
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-gray-900">{ticket.busName}</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: {ticket.id}</p>
                         </div>
                       </div>
                       <Badge 
                         className={ticket.status === 'Confirmed' ? 'bg-teal-500' : 'bg-gray-500'}
                       >
                         {ticket.status}
                       </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                       <div className="flex items-center gap-4">
                          <div className="text-center bg-gray-50 px-3 py-2 rounded-lg">
                             <Calendar className="h-4 w-4 text-primary mb-1 mx-auto" />
                             <p className="text-xs font-bold text-gray-900">{ticket.date}</p>
                          </div>
                          <div className="text-center bg-gray-50 px-3 py-2 rounded-lg">
                             <Clock className="h-4 w-4 text-primary mb-1 mx-auto" />
                             <p className="text-xs font-bold text-gray-900">{ticket.time}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 col-span-2">
                          <div className="flex-1">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                             <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                               {ticket.from} <ChevronRight className="h-3 w-3" /> {ticket.to}
                             </p>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seats</p>
                             <p className="text-sm font-bold text-gray-800">{ticket.seats.join(', ')}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 flex flex-col items-center justify-center md:border-l border-gray-200 min-w-[200px]">
                     <div className="text-center mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Paid Amount</p>
                        <p className="text-2xl font-black text-primary">${ticket.amount}</p>
                     </div>
                     <Button variant="outline" className="w-full gap-2 border-primary text-primary font-bold hover:bg-primary hover:text-white">
                        <Download className="h-4 w-4" /> E-Ticket
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
