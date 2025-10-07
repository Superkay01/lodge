'use client';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-16 bg-cover bg-center relative" style={{ backgroundImage: 'url(/CTA.jpg)' }}>
        <span className='bg-black/20  absolute inset-0 z-0'></span>
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#0025cc]">Ready to Find Your Dream Home?</h2>
        <p className="text-lg mb-6 text-[#0025cc] font-medium w-[50%] m-auto">
          Whether you’re buying or renting, we’ve got the perfect property for you. Start your journey today with just a few clicks.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/register" className="px-8 py-3 bg-[#0025cc] text-white font-bold cursor-pointer rounded-lg hover:bg-yellow-400 transition duration-300">
            Get Started
          </Link>
          <Link href="/contact" className="px-8 py-3 border-2 border-[#0025cc] text-[#0025cc] font-bold cursor-pointer rounded-lg hover:bg-[#0025cc] hover:text-white transition duration-300">
           Contact Us
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CTASection;