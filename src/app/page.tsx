import Navbar from "@/components/Navbar";
import BusSearchForm from "@/components/BusSearchForm";
import PopularDestinations from "@/components/PopularDestinations";
import Testimonials from "@/components/Testimonials";
import Image from "next/image";
import { ShieldCheck, Zap, CreditCard, Headphones, Bus, Tag, Smartphone, MapPin, Globe } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-rwanda");
  const moveAd = PlaceHolderImages.find(img => img.id === "move-ad");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[700px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover animate-in fade-in zoom-in duration-1000"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold mb-8 border border-white/20 animate-in fade-in slide-in-from-top-4 duration-700">
                <Tag className="h-4 w-4 text-accent" />
                <span>Book now for 10% off with Mobile Money! Code: MOMO10</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                Travel Across <span className="text-accent underline decoration-accent/30 underline-offset-8">Rwanda</span> with Ease
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Kigali to Rubavu, Musanze to Butare – Book your bus tickets in seconds with MoMo, Card, or Cash. Secure, reliable, and instant.
              </p>
              
              <div className="relative z-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <BusSearchForm className="shadow-2xl border-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-20 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row items-center transition-all hover:shadow-2xl duration-500">
              <div className="p-10 md:p-16 flex-grow">
                <Badge className="mb-6 bg-accent/10 text-accent border-none font-bold px-4 py-1">PROMOTED</Badge>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Need a ride to the park?</h3>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg">
                  Avoid the hassle of getting to the station. Download the <b className="text-primary font-bold">Move</b> app and get a <b className="text-accent font-bold">20% discount</b> on your ride to any bus park in Kigali.
                </p>
                <Button className="bg-gray-900 text-white hover:bg-black rounded-xl px-10 h-14 font-bold transition-all active:scale-95 shadow-lg">Get Move App</Button>
              </div>
              {moveAd && (
                <div className="relative h-80 md:h-[450px] w-full md:w-1/2 group overflow-hidden">
                  <Image 
                    src={moveAd.imageUrl} 
                    alt="Move Ride" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    data-ai-hint={moveAd.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Secure Local Payments</h2>
              <p className="text-muted-foreground font-medium text-lg">Fully integrated with the Rwandan financial ecosystem</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
               {[
                 { label: "MTN MoMo", icon: Smartphone, color: "bg-yellow-400" },
                 { label: "Airtel Money", icon: Smartphone, color: "bg-red-600" },
                 { label: "Visa / Master", icon: CreditCard, color: "bg-blue-600" },
                 { label: "Bank Transfer", icon: Globe, color: "bg-green-600" }
               ].map((pay, i) => (
                 <div key={i} className="flex flex-col items-center gap-4 group transition-transform hover:-translate-y-2">
                   <div className={`${pay.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200`}>
                     <pay.icon className="h-8 w-8 text-white" />
                   </div>
                   <span className="font-bold text-gray-700 uppercase tracking-widest text-[10px]">{pay.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        <PopularDestinations />

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Why Choose BusBook Rwanda?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                The most reliable and modern way to travel across the land of a thousand hills.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Verified Fleet", desc: "We only partner with registered Rwandan transport companies like Ritco and Volcano.", icon: ShieldCheck, color: "primary" },
                { title: "Digital Tickets", desc: "Instant E-tickets with QR codes for fast boarding at any bus terminal in Rwanda.", icon: Zap, color: "accent" },
                { title: "Real-time Tracking", desc: "Monitor your bus schedule and boarding time directly from your mobile dashboard.", icon: Smartphone, color: "primary" },
                { title: "Local Support", desc: "Our Kinyarwanda and English support team is available 24/7 to assist you.", icon: Headphones, color: "accent" }
              ].map((feat, i) => (
                <div key={i} className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className={`bg-${feat.color}/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-${feat.color} transition-colors`}>
                    <feat.icon className={`h-8 w-8 text-${feat.color} group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
      </main>

      <footer className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-accent p-2 rounded-xl">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-bold tracking-tight text-white uppercase">BusBook</span>
                  <span className="text-[8px] font-bold tracking-[0.4em] text-accent">RWANDA</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Connecting Rwanda through reliable, digital bus booking. From Kigali to the provinces, we make travel seamless.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-accent transition-all cursor-pointer"><Globe className="h-5 w-5" /></div>
                 <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-accent transition-all cursor-pointer"><Smartphone className="h-5 w-5" /></div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Destinations</h4>
              <div className="grid grid-cols-2 gap-4">
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li><Link href="/search?to=Musanze" className="hover:text-white transition-colors">Musanze</Link></li>
                  <li><Link href="/search?to=Rubavu" className="hover:text-white transition-colors">Rubavu</Link></li>
                  <li><Link href="/search?to=Gicumbi" className="hover:text-white transition-colors">Gicumbi</Link></li>
                  <li><Link href="/search?to=Karongi" className="hover:text-white transition-colors">Karongi</Link></li>
                </ul>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li><Link href="/search?to=Huye" className="hover:text-white transition-colors">Huye</Link></li>
                  <li><Link href="/search?to=Rwamagana" className="hover:text-white transition-colors">Rwamagana</Link></li>
                  <li><Link href="/search?to=Nyagatare" className="hover:text-white transition-colors">Nyagatare</Link></li>
                  <li><Link href="/search?to=Rusizi" className="hover:text-white transition-colors">Rusizi</Link></li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Terminals</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Nyabugogo Main Park</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Remera Terminal</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Musanze Int. Park</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Rubavu Main Terminal</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-white">Support</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                   <p className="text-white font-semibold text-xs mb-1">Customer Care</p>
                   <p className="hover:text-accent transition-colors">support@busbook.rw</p>
                   <p>+250 788 000 000</p>
                </li>
                <li>
                   <p className="text-white font-semibold text-xs mb-1">Headquarters</p>
                   <p>Kigali Heights, 4th Floor</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} BusBook Rwanda. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Terms</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacy</Link>
              <Link href="/admin/dashboard" className="text-accent hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em]">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}