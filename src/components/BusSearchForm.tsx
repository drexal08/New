
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, Search, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function BusSearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const firestore = useFirestore();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Fetch locations from Firestore
  const locationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "locations"), orderBy("name", "asc"));
  }, [firestore]);

  const { data: locations } = useCollection(locationsQuery);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

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
        "bg-white p-6 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4 items-end border border-gray-100",
        className
      )}
    >
      <div className="w-full space-y-2">
        <Label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Departure Point</Label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            placeholder="From: Kigali, Musanze..."
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-primary font-bold text-gray-700"
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
          className="rounded-full bg-gray-100 hover:bg-primary/10 hover:text-primary h-12 w-12"
        >
          <ArrowRightLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full space-y-2">
        <Label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Destination</Label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
          <Input
            placeholder="To: Rubavu, Huye..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-primary font-bold text-gray-700"
            list="stations"
          />
        </div>
      </div>

      <div className="w-full space-y-2">
        <Label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Travel Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 justify-start text-left font-bold bg-gray-50 border-none rounded-2xl text-gray-700",
                (!mounted || !date) && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
              {mounted && date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full lg:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl gap-2 shadow-lg shadow-primary/20">
        <Search className="h-5 w-5" />
        FIND BUS
      </Button>

      <datalist id="stations">
        {locations?.map((loc) => (
          <option key={loc.id} value={loc.name} />
        ))}
      </datalist>
    </form>
  );
}
