
import Navbar from "@/components/Navbar";
import BusSearchForm from "@/components/BusSearchForm";
import PopularDestinations from "@/components/PopularDestinations";
import Testimonials from "@/components/Testimonials";
import Image from "next/image";
import { ShieldCheck, Zap, CreditCard, Headphones, Bus, Gift, Tag, Globe } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bus");

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
                <span>Get 20% off on your first booking! Code: FIRSTEZ</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                Travel Smart with <span className="text-accent underline decoration-accent/30">EZ Bus</span>
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
                Book your bus tickets in seconds. Reliable routes, comfortable seats, and the best prices guaranteed across the nation.
              </p>
              
              <div className="relative z-20">
                <BusSearchForm className="shadow-2xl border border-gray-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Gift, title: "Student Discounts", desc: "Up to 15% off for valid student ID holders", color: "bg-blue-50 text-blue-600" },
                { icon: Globe, title: "Intercity Pass", desc: "Unlimited travel between cities starting at $99/mo", color: "bg-teal-50 text-teal-600" },
                { icon: Zap, title: "Early Bird", desc: "Book 7 days in advance and save 10% automatically", color: "bg-purple-50 text-purple-600" }
              ].map((promo, i) => (
                <div key={i} className="flex items-center gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <div className={`p-3 rounded-xl ${promo.color}`}>
                    <promo.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{promo.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{promo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PopularDestinations />

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why choose EZ Bus?</h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
                We make bus travel simple, affordable, and comfortable for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Safe & Secure</h3>
                <p className="text-gray-500 text-base leading-relaxed">Your safety is our top priority with verified operators and secure payments.</p>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-accent transition-colors">
                  <Zap className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Booking</h3>
                <p className="text-gray-500 text-base leading-relaxed">No more queues. Book your preferred seat in just a few clicks from anywhere.</p>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-primary/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-primary transition-colors">
                  <CreditCard className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Best Prices</h3>
                <p className="text-gray-500 text-base leading-relaxed">Enjoy exclusive deals and discounts that you won't find anywhere else.</p>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="bg-accent/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-accent transition-colors">
                  <Headphones className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">24/7 Support</h3>
                <p className="text-gray-500 text-base leading-relaxed">Our dedicated support team is always ready to assist you during your journey.</p>
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
                <span className="text-3xl font-black tracking-tight text-white">EZ Bus</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Leading bus ticket booking platform. Connecting cities and people with comfort and care since 2010.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-8 text-white">Quick Links</h4>
              <ul className="space-y-4 text-gray-400 text-base">
                <li><a href="#" className="hover:text-accent transition-colors font-medium">About EZ Bus</a></li>
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Partner with us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-8 text-white">Legal</h4>
              <ul className="space-y-4 text-gray-400 text-base">
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors font-medium">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-8 text-white">Contact</h4>
              <ul className="space-y-4 text-gray-400 text-base">
                <li className="font-medium">support@ezbus.com</li>
                <li className="font-medium">1-800-EZBUS-HELP</li>
                <li className="font-medium">123 Transit Ave, Suite 500<br />New York, NY 10001</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 font-medium">
              © {new Date().getFullYear()} EZ Bus Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="text-gray-500 hover:text-white transition-colors font-bold text-sm">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
