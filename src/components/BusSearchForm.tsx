
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, Search, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MOCK_STATIONS } from "@/lib/mock-data";

export default function BusSearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.set("from", origin);
    if (destination) params.set("to", destination);
    if (date) params.set("date", date.toISOString());
    router.push(`/search?${params.toString()}`);
  };

  const swapPlaces = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "bg-white p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row gap-4 items-end",
        className
      )}
    >
      <div className="w-full space-y-2">
        <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">From</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Origin City"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-none focus-visible:ring-primary"
            list="stations"
          />
        </div>
      </div>

      <div className="hidden lg:block pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={swapPlaces}
          className="rounded-full bg-gray-100 hover:bg-primary/10 hover:text-primary"
        >
          <ArrowRightLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full space-y-2">
        <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">To</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Destination City"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-none focus-visible:ring-primary"
            list="stations"
          />
        </div>
      </div>

      <div className="w-full space-y-2">
        <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Travel Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal bg-gray-50 border-none",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full lg:w-auto h-12 px-8 bg-accent hover:bg-accent/90 text-white font-bold gap-2">
        <Search className="h-5 w-5" />
        Search
      </Button>

      <datalist id="stations">
        {MOCK_STATIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </form>
  );
}
