// components/StatsCounter.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

type Setter = React.Dispatch<React.SetStateAction<number>>;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function StatsCounter() {
  const [listings, setListings] = useState(0);
  const [propertiesSold, setPropertiesSold] = useState(0);
  const [views, setViews] = useState(0);
  const [users, setUsers] = useState(0);

  // targets kept separately so we can re-animate without refetching
  const targetsRef = useRef({ listings: 0, propertiesSold: 0, views: 0, users: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const animatedRef = useRef(false); // ensure we animate once when visible

  // Counter animation using rAF (smoother than setInterval) with reduced-motion support
  const animateTo = (target: number, setter: Setter, duration = 800) => {
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || target <= 0) {
      setter(target);
      return;
    }

    const start = performance.now();
    const from = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const value = Math.round(from + (target - from) * eased);
      setter(value);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Fetch stats
  const fetchData = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();

      targetsRef.current = {
        listings: Number(data.listings || 0),
        propertiesSold: Number(data.propertiesSold || 0),
        views: Number(data.views || 0),
        users: Number(data.users || 0),
      };

      // If already visible (e.g., desktop), animate immediately
      if (animatedRef.current) {
        const t = targetsRef.current;
        animateTo(t.listings, setListings);
        animateTo(t.propertiesSold, setPropertiesSold);
        animateTo(t.views, setViews);
        animateTo(t.users, setUsers);
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  // Visibility observer — trigger animation when section enters viewport (great for mobile)
  useEffect(() => {
    fetchData();
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const t = targetsRef.current;
          animateTo(t.listings, setListings);
          animateTo(t.propertiesSold, setPropertiesSold);
          animateTo(t.views, setViews);
          animateTo(t.users, setUsers);
        }
      },
      { root: null, threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    const interval = setInterval(fetchData, 30000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Compact number formatting that still reads well on small screens
  const fmt = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  const Card = ({
    value,
    label,
    valueClass,
  }: {
    value: number;
    label: string;
    valueClass: string;
  }) => (
    <div
      className="p-4 sm:p-6 bg-white shadow-md sm:shadow-lg rounded-2xl ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-indigo-500"
      role="group"
      aria-label={label}
    >
      <h3 className={`text-2xl sm:text-3xl font-semibold ${valueClass}`} aria-live="polite">
        {fmt.format(value)}
      </h3>
      <p className="text-sm sm:text-base text-gray-700 mt-1">{label}</p>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-10 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Platform Stats</h2>

        {/* On mobile: 1 column; Tablet: 2; Desktop: 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <Card value={listings} label="Total Listings" valueClass="text-blue-600" />
          <Card value={propertiesSold} label="Properties Sold" valueClass="text-green-600" />
          <Card value={views} label="Total Views" valueClass="text-yellow-600" />
          <Card value={users} label="Total Users" valueClass="text-purple-600" />
        </div>
      </div>
    </section>
  );
}
