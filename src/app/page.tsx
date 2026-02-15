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
        <section className="relative h-[750px] flex items-center overflow-hidden">
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
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-8 border border-white/20 animate-in fade-in slide-in-from-top-4 duration-700">
                <Tag className="h-4 w-4 text-accent" />
                <span>Book now for 10% off with Mobile Money! Code: MOMO10</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-700">
                Travel Across <span className="text-accent underline decoration-accent/30">Rwanda</span> with Ease
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Kigali to Rubavu, Musanze to Butare – Book your bus tickets in seconds with MoMo, Card, or Cash. Secure, reliable, and instant.
              </p>
              
              <div className="relative z-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <BusSearchForm className="shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-20 bg-gray-50/50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center transition-all hover:shadow-2xl duration-500 animate-in fade-in slide-in-from-bottom-8">
              <div className="p-10 md:p-16 flex-grow">
                <Badge className="mb-6 bg-accent/15 text-accent border-none font-black px-4 py-1">PROMOTED</Badge>
                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Need a ride to the park?</h3>
                <p className="text-gray-500 text-xl mb-10 leading-relaxed max-w-lg">
                  Avoid the hassle of getting to the station. Download the <b className="text-primary">Move</b> app and get a <b className="text-accent">20% discount</b> on your ride to any bus park in Kigali.
                </p>
                <Button className="bg-gray-900 text-white hover:bg-black rounded-2xl px-12 h-16 font-black text-xl transition-all active:scale-95 shadow-lg shadow-black/10">Get Move App</Button>
              </div>
              {moveAd && (
                <div className="relative h-80 md:h-[450px] w-full md:w-1/2 group overflow-hidden">
                  <Image 
                    src={moveAd.imageUrl} 
                    alt="Move Ride" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    data-ai-hint={moveAd.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Methods Info */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-in fade-in duration-700">
              <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-[0.2em]">Secure Local Payments</h2>
              <p className="text-gray-500 font-bold text-lg">Fully integrated with the Rwandan financial ecosystem</p>
            </div>
            <div className="flex flex-wrap justify-center gap-16 md:gap-24">
               {[
                 { label: "MTN MoMo", icon: Smartphone, color: "bg-yellow-400" },
                 { label: "Airtel Money", icon: Smartphone, color: "bg-red-600" },
                 { label: "Visa / Master", icon: CreditCard, color: "bg-blue-600" },
                 { label: "Bank Transfer", icon: Globe, color: "bg-green-600" }
               ].map((pay, i) => (
                 <div key={i} className="flex flex-col items-center gap-6 group animate-in zoom-in duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                   <div className={`${pay.color} w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-${pay.color.split('-')[1]}/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                     <pay.icon className="h-12 w-12 text-white" />
                   </div>
                   <span className="font-black text-gray-800 uppercase tracking-widest text-xs group-hover:text-primary transition-colors">{pay.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        <div className="animate-in fade-in duration-1000">
          <PopularDestinations />
        </div>

        {/* Features Section */}
        <section className="py-28 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Why Choose BusBook Rwanda?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-bold text-xl leading-relaxed">
                The most reliable and modern way to travel across the land of a thousand hills.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-10">
              {[
                { title: "Verified Fleet", desc: "We only partner with registered Rwandan transport companies like Ritco and Volcano.", icon: ShieldCheck, color: "primary" },
                { title: "Digital Tickets", desc: "Instant E-tickets with QR codes for fast boarding at any bus terminal in Rwanda.", icon: Zap, color: "accent" },
                { title: "Real-time Tracking", desc: "Monitor your bus schedule and boarding time directly from your mobile dashboard.", icon: Smartphone, color: "primary" },
                { title: "Local Support", desc: "Our Kinyarwanda and English support team is available 24/7 to assist you.", icon: Headphones, color: "accent" }
              ].map((feat, i) => (
                <div key={i} className="p-12 rounded-[3rem] bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-6" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`bg-${feat.color}/10 p-6 rounded-[1.5rem] w-fit mb-10 group-hover:bg-${feat.color} transition-colors duration-500`}>
                    <feat.icon className={`h-10 w-10 text-${feat.color} group-hover:text-white transition-colors duration-500`} />
                  </div>
                  <h3 className="text-2xl font-black mb-5 text-gray-900 group-hover:text-primary transition-colors">{feat.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="animate-in fade-in duration-1000">
          <Testimonials />
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-accent p-3 rounded-2xl">
                  <Bus className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-col -space-y-1.5">
                  <span className="text-3xl font-black tracking-tighter text-white uppercase">BusBook</span>
                  <span className="text-[10px] font-black tracking-[0.5em] text-accent">RWANDA</span>
                </div>
              </div>
              <p className="text-gray-400 text-xl leading-relaxed mb-10 font-medium">
                Connecting Rwanda through reliable, digital bus booking. From Kigali to the provinces, we make travel seamless.
              </p>
              <div className="flex gap-6">
                 <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-accent transition-all duration-300 cursor-pointer active:scale-90"><Globe className="h-6 w-6" /></div>
                 <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-accent transition-all duration-300 cursor-pointer active:scale-90"><Smartphone className="h-6 w-6" /></div>
              </div>
            </div>

            <div>
              <h4 className="font-black text-xl mb-12 text-white uppercase tracking-[0.2em] text-sm">Destinations</h4>
              <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <p className="text-accent text-xs font-black uppercase tracking-widest mb-4">North & West</p>
                  <ul className="space-y-4 text-gray-400 text-base font-bold">
                    <li><Link href="/search?to=Musanze" className="hover:text-white hover:pl-2 transition-all block">Musanze</Link></li>
                    <li><Link href="/search?to=Rubavu" className="hover:text-white hover:pl-2 transition-all block">Rubavu</Link></li>
                    <li><Link href="/search?to=Gicumbi" className="hover:text-white hover:pl-2 transition-all block">Gicumbi</Link></li>
                    <li><Link href="/search?to=Karongi" className="hover:text-white hover:pl-2 transition-all block">Karongi</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-accent text-xs font-black uppercase tracking-widest mb-4">South & East</p>
                  <ul className="space-y-4 text-gray-400 text-base font-bold">
                    <li><Link href="/search?to=Huye" className="hover:text-white hover:pl-2 transition-all block">Huye</Link></li>
                    <li><Link href="/search?to=Rwamagana" className="hover:text-white hover:pl-2 transition-all block">Rwamagana</Link></li>
                    <li><Link href="/search?to=Nyagatare" className="hover:text-white hover:pl-2 transition-all block">Nyagatare</Link></li>
                    <li><Link href="/search?to=Rusizi" className="hover:text-white hover:pl-2 transition-all block">Rusizi</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-black text-xl mb-12 text-white uppercase tracking-[0.2em] text-sm">Terminals</h4>
              <ul className="space-y-5 text-gray-400 text-base font-bold">
                <li className="flex items-center gap-3 group cursor-default"><MapPin className="h-4 w-4 text-accent group-hover:scale-125 transition-transform" /> Nyabugogo Main Park</li>
                <li className="flex items-center gap-3 group cursor-default"><MapPin className="h-4 w-4 text-accent group-hover:scale-125 transition-transform" /> Remera Terminal</li>
                <li className="flex items-center gap-3 group cursor-default"><MapPin className="h-4 w-4 text-accent group-hover:scale-125 transition-transform" /> Musanze International</li>
                <li className="flex items-center gap-3 group cursor-default"><MapPin className="h-4 w-4 text-accent group-hover:scale-125 transition-transform" /> Rubavu Main Terminal</li>
                <li className="flex items-center gap-3 group cursor-default"><MapPin className="h-4 w-4 text-accent group-hover:scale-125 transition-transform" /> Huye Taxi Park</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xl mb-12 text-white uppercase tracking-[0.2em] text-sm">Contact Us</h4>
              <ul className="space-y-8 text-gray-400 text-base font-bold">
                <li>
                   <p className="text-white font-black mb-2 uppercase text-xs tracking-widest">Customer Support</p>
                   <p className="hover:text-accent transition-colors">support@busbook.rw</p>
                   <p>+250 788 000 000</p>
                </li>
                <li>
                   <p className="text-white font-black mb-2 uppercase text-xs tracking-widest">Headquarters</p>
                   <p>Kigali Heights, 4th Floor</p>
                   <p>Kigali, Rwanda</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-16 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-gray-500 font-bold text-base">
              © {new Date().getFullYear()} BusBook Rwanda. Powered by Rwanda Transport Authority.
            </p>
            <div className="flex gap-12">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Terms</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Privacy</Link>
              <Link href="/admin/dashboard" className="text-accent hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em] hover:underline">Admin Access</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
