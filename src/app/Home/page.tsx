
'use client';
import Container from '../ui/Container';
import Image from 'next/image';

export default function HeroSearch() {
  function onSubmit(form: FormData) {
    const params = new URLSearchParams(form as unknown as Record<string, string>);
    window.location.href = `/listings?${params.toString()}`;
  }

  return (
    <section className="relative min-h-[80vh] grid place-items-center">
      
      <Image
        src="/slide1.jpg"
        alt="Background Slide"
        width={1200}
        height={600}
        priority
        className="absolute inset-0 object-cover object-top w-full h-full"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <Container className="relative text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">Find your next lodge</h1>
        <p className="mt-2 opacity-90">Search by city, price, or bedrooms</p>
        
        <form
          action={onSubmit}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 bg-white text-gray-900 rounded-2xl p-3 md:p-4"
        >
          <input name="city" placeholder="City" className="px-3 py-2 rounded-lg border" />
          <input name="minPrice" placeholder="Min Price" type="number" className="px-3 py-2 rounded-lg border" />
          <input name="beds" placeholder="Beds" type="number" className="px-3 py-2 rounded-lg border" />
          <button className="rounded-xl px-4 py-2 font-medium bg-black text-white">Search</button>
        </form>
      </Container>
    </section>
  );
}
