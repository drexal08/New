
import Navbar from "@/components/Navbar";
import BusSearchForm from "@/components/BusSearchForm";
import PopularDestinations from "@/components/PopularDestinations";
import Testimonials from "@/components/Testimonials";
import Image from "next/image";
import { ShieldCheck, Zap, CreditCard, Headphones, Bus, Tag, Smartphone } from "lucide-react";
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
        <section className="relative h-[650px] flex items-center overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-6 border border-white/20">
                <Tag className="h-4 w-4 text-accent" />
                <span>Book now for 10% off with Mobile Money! Code: MOMO10</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                Travel Across <span className="text-accent underline decoration-accent/30 text-nowrap">Rwanda</span> with Bus Booking
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
                Kigali to Rubavu, Musanze to Butare – Book your bus tickets in seconds with MoMo, Card, or Cash.
              </p>
              
              <div className="relative z-20">
                <BusSearchForm className="shadow-2xl border border-gray-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 flex-grow">
                <Badge className="mb-4 bg-accent/10 text-accent border-none font-bold">SPONSORED</Badge>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Need a ride to the park?</h3>
                <p className="text-gray-500 text-lg mb-8">Download the <b>Move</b> app and get a discount on your ride to Nyabugogo Bus Park.</p>
                <Button className="bg-gray-900 text-white hover:bg-black rounded-full px-8 h-12">Get Move App</Button>
              </div>
              {moveAd && (
                <div className="relative h-64 md:h-auto w-full md:w-1/2 aspect-video">
                  <Image 
                    src={moveAd.imageUrl} 
                    alt="Move Ride" 
                    fill 
                    className="object-cover"
                    data-ai-hint={moveAd.imageHint}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Methods Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Secure Payment Options</h2>
              <p className="text-gray-500">Pay using your favorite method</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12">
               <div className="flex flex-col items-center gap-3">
                 <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                   <Smartphone className="h-8 w-8 text-white" />
                 </div>
                 <span className="font-bold text-gray-700">MTN MoMo</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                 <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                   <Smartphone className="h-8 w-8 text-white" />
                 </div>
                 <span className="font-bold text-gray-700">Airtel Money</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                   <CreditCard className="h-8 w-8 text-white" />
                 </div>
                 <span className="font-bold text-gray-700">Visa / Master</span>
               </div>
            </div>
          </div>
        </section>

        <PopularDestinations />

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why choose Bus Booking Rwanda?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
                The most reliable way to travel across the land of a thousand hills.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Verified Companies</h3>
                <p className="text-gray-500 text-base leading-relaxed">We only partner with registered Rwandan transport companies like Ritco and Volcano.</p>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-accent transition-colors">
                  <Zap className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">QR Tickets</h3>
                <p className="text-gray-500 text-base leading-relaxed">Get an instant digital ticket with a QR code for quick boarding at the bus park.</p>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <Smartphone className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">MoMo Integrated</h3>
                <p className="text-gray-500 text-base leading-relaxed">The easiest way to pay. Fully integrated with MTN and Airtel Mobile Money.</p>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-accent transition-colors">
                  <Headphones className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">24/7 Support</h3>
                <p className="text-gray-500 text-base leading-relaxed">Our support team is available day and night to help with your bookings.</p>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
      </main>

      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-accent p-2 rounded-lg">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-black tracking-tight text-white uppercase">Bus Booking</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Rwanda's leading bus ticket booking platform. Connecting Kigali to every corner of the country.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-8 text-white">Destinations</h4>
              <ul className="space-y-4 text-gray-400 text-base">
                <li><Link href="/search?to=Rubavu" className="hover:text-accent transition-colors font-medium">Rubavu (Gisenyi)</Link></li>
                <li><Link href="/search?to=Musanze" className="hover:text-accent transition-colors font-medium">Musanze (Ruhengeri)</Link></li>
                <li><Link href="/search?to=Huye" className="hover:text-accent transition-colors font-medium">Huye (Butare)</Link></li>
                <li><Link href="/search?to=Rusizi" className="hover:text-accent transition-colors font-medium">Rusizi (Cyangugu)</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-8 text-white">Accounts</h4>
              <ul className="space-y-4 text-gray-400 text-base">
                <li><Link href="#" className="hover:text-accent transition-colors font-medium">Passenger Account</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors font-medium">Transport Company Account</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors font-medium">Agent Portal</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors font-medium">Advertise with Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-8 text-white">Contact</h4>
              <ul className="space-y-4 text-gray-400 text-base">
                <li className="font-medium">support@busbooking.rw</li>
                <li className="font-medium">+250 788 000 000</li>
                <li className="font-medium">Kigali Heights, 4th Floor<br />Kigali, Rwanda</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 font-medium">
              © {new Date().getFullYear()} Bus Booking Rwanda. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Facebook', 'Twitter', 'Instagram'].map(social => (
                <a key={social} href="#" className="text-gray-500 hover:text-white transition-colors font-bold text-sm">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
