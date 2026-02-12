
"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Calendar, Clock, Download, ChevronRight, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyTickets() {
  const mockTickets = [
    {
      id: "EZ-RW-98234",
      busName: "Volcano Express",
      from: "Kigali",
      to: "Huye",
      date: "Oct 24, 2023",
      time: "07:00 AM",
      seats: ["12A", "12B"],
      status: "Confirmed",
      amount: 7200,
      busPark: "Nyabugogo Bus Park"
    },
    {
      id: "EZ-RW-12344",
      busName: "Ritco",
      from: "Rubavu",
      to: "Kigali",
      date: "Oct 15, 2023",
      time: "10:30 AM",
      seats: ["04C"],
      status: "Completed",
      amount: 3200,
      busPark: "Rubavu Bus Park"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Rwandan Trips</h1>
          <p className="text-gray-500 font-medium">Digital tickets for your journeys across the land of a thousand hills.</p>
        </div>

        <div className="space-y-6">
          {mockTickets.map((ticket) => (
            <Card key={ticket.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow bg-white rounded-3xl">
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
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">TICKET ID: {ticket.id}</p>
                         </div>
                       </div>
                       <Badge 
                         className={ticket.status === 'Confirmed' ? 'bg-teal-500 text-white border-none' : 'bg-gray-500 text-white border-none'}
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
                             <p className="text-[10px] text-gray-500 mt-1 font-medium">{ticket.busPark}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seats</p>
                             <p className="text-sm font-bold text-gray-800">{ticket.seats.join(', ')}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-8 flex flex-col items-center justify-center md:border-l border-gray-200 min-w-[200px]">
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <QrCode className="h-24 w-24 text-gray-900" />
                        <p className="text-[8px] text-center mt-2 font-black uppercase text-gray-400">Scan at Bus</p>
                     </div>
                     <div className="text-center mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Paid</p>
                        <p className="text-xl font-black text-primary">{ticket.amount.toLocaleString()} RWF</p>
                     </div>
                     <Button variant="outline" className="w-full gap-2 border-primary text-primary font-bold hover:bg-primary hover:text-white rounded-xl">
                        <Download className="h-4 w-4" /> E-Bill
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
