
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
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-6 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Tag className="h-4 w-4 text-accent" />
                <span>Book now for 10% off with Mobile Money! Code: MOMO10</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                Travel Across <span className="text-accent underline decoration-accent/30">Rwanda</span> with Ease
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Kigali to Rubavu, Musanze to Butare – Book your bus tickets in seconds with MoMo, Card, or Cash. Secure, reliable, and instant.
              </p>
              
              <div className="relative z-20 animate-in fade-in zoom-in-95 duration-1000">
                <BusSearchForm className="shadow-2xl border border-gray-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row items-center transition-transform hover:scale-[1.01]">
              <div className="p-8 md:p-12 flex-grow">
                <Badge className="mb-4 bg-accent/10 text-accent border-none font-bold">PROMOTED</Badge>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Need a ride to the park?</h3>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  Avoid the hassle of getting to the station. Download the <b>Move</b> app and get a <b>20% discount</b> on your ride to any bus park in Kigali.
                </p>
                <Button className="bg-gray-900 text-white hover:bg-black rounded-full px-10 h-14 font-bold text-lg">Get Move App</Button>
              </div>
              {moveAd && (
                <div className="relative h-64 md:h-80 w-full md:w-1/2">
                  <Image 
                    src={moveAd.imageUrl} 
                    alt="Move Ride" 
                    fill 
                    className="object-cover"
                    data-ai-hint={moveAd.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Methods Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-widest">Secure Local Payments</h2>
              <p className="text-gray-500 font-medium">Fully integrated with the Rwandan financial ecosystem</p>
            </div>
            <div className="flex flex-wrap justify-center gap-16">
               <div className="flex flex-col items-center gap-4 group">
                 <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <Smartphone className="h-10 w-10 text-white" />
                 </div>
                 <span className="font-black text-gray-700 uppercase tracking-widest text-xs">MTN MoMo</span>
               </div>
               <div className="flex flex-col items-center gap-4 group">
                 <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <Smartphone className="h-10 w-10 text-white" />
                 </div>
                 <span className="font-black text-gray-700 uppercase tracking-widest text-xs">Airtel Money</span>
               </div>
               <div className="flex flex-col items-center gap-4 group">
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <CreditCard className="h-10 w-10 text-white" />
                 </div>
                 <span className="font-black text-gray-700 uppercase tracking-widest text-xs">Visa / Master</span>
               </div>
               <div className="flex flex-col items-center gap-4 group">
                 <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <Globe className="h-10 w-10 text-white" />
                 </div>
                 <span className="font-black text-gray-700 uppercase tracking-widest text-xs">Bank Transfer</span>
               </div>
            </div>
          </div>
        </section>

        <PopularDestinations />

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why Choose BusBook Rwanda?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
                The most reliable and modern way to travel across the land of a thousand hills.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Verified Fleet</h3>
                <p className="text-gray-500 text-base leading-relaxed">We only partner with registered Rwandan transport companies like Ritco and Volcano.</p>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-accent transition-colors">
                  <Zap className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Digital Tickets</h3>
                <p className="text-gray-500 text-base leading-relaxed">Instant E-tickets with QR codes for fast boarding at any bus terminal in Rwanda.</p>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <Smartphone className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Real-time Tracking</h3>
                <p className="text-gray-500 text-base leading-relaxed">Monitor your bus schedule and boarding time directly from your mobile dashboard.</p>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-accent transition-colors">
                  <Headphones className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Local Support</h3>
                <p className="text-gray-500 text-base leading-relaxed">Our Kinyarwanda and English support team is available 24/7 to assist you.</p>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
      </main>

      <footer className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-accent p-2.5 rounded-xl">
                  <Bus className="h-7 w-7 text-white" />
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-2xl font-black tracking-tighter text-white uppercase">BusBook</span>
                  <span className="text-[8px] font-black tracking-[0.4em] text-accent">RWANDA</span>
                </div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Connecting Rwanda through reliable, digital bus booking. From Kigali to the provinces, we make travel seamless.
              </p>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"><Globe className="h-5 w-5" /></div>
                 <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"><Smartphone className="h-5 w-5" /></div>
              </div>
            </div>

            <div>
              <h4 className="font-black text-xl mb-10 text-white uppercase tracking-widest text-sm">Destinations</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-3">North & West</p>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li><Link href="/search?to=Musanze" className="hover:text-white transition-colors">Musanze</Link></li>
                    <li><Link href="/search?to=Rubavu" className="hover:text-white transition-colors">Rubavu</Link></li>
                    <li><Link href="/search?to=Gicumbi" className="hover:text-white transition-colors">Gicumbi</Link></li>
                    <li><Link href="/search?to=Karongi" className="hover:text-white transition-colors">Karongi</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-3">South & East</p>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li><Link href="/search?to=Huye" className="hover:text-white transition-colors">Huye</Link></li>
                    <li><Link href="/search?to=Rwamagana" className="hover:text-white transition-colors">Rwamagana</Link></li>
                    <li><Link href="/search?to=Nyagatare" className="hover:text-white transition-colors">Nyagatare</Link></li>
                    <li><Link href="/search?to=Rusizi" className="hover:text-white transition-colors">Rusizi</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-black text-xl mb-10 text-white uppercase tracking-widest text-sm">Terminals</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Nyabugogo Main Park</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Remera Terminal</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Musanze International</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Rubavu Main Terminal</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-accent" /> Huye Taxi Park</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xl mb-10 text-white uppercase tracking-widest text-sm">Contact Us</h4>
              <ul className="space-y-6 text-gray-400 text-sm">
                <li>
                   <p className="text-white font-bold mb-1">Customer Support</p>
                   <p>support@busbook.rw</p>
                   <p>+250 788 000 000</p>
                </li>
                <li>
                   <p className="text-white font-bold mb-1">Headquarters</p>
                   <p>Kigali Heights, 4th Floor</p>
                   <p>Kigali, Rwanda</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-500 font-medium text-sm">
              © {new Date().getFullYear()} BusBook Rwanda. Powered by Rwanda Transport Authority.
            </p>
            <div className="flex gap-8">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Terms</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Privacy</Link>
              <Link href="/admin/dashboard" className="text-accent hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Admin Access</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
