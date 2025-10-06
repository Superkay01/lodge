
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import PropertyCard from '@/components/landing/PropertyCard';


type MediaItem = { url: string; publicId?: string };
type ListingDoc = {
  campus?: string;
  createdAt?: Timestamp; // Fixed: Use Timestamp instead of any
  isVerified?: string;
  landlordId?: string;
  locationArea?: string;
  photos?: MediaItem[] | string;
  pricePerYear?: string;
  roomType?: string;
  status?: string;
  title?: string;
};
type Row = ListingDoc & { id: string; createdAtMs: number };

export default function ListingSection() {
  const [listings, setListings] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u?.uid ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      limit(8)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Row[] = snap.docs.map((d) => {
          const docData = d.data() as ListingDoc;
          const ms =
            typeof docData.createdAt?.toMillis === 'function'
              ? docData.createdAt.toMillis()
              : typeof docData.createdAt?.seconds === 'number'
              ? docData.createdAt.seconds * 1000
              : 0;
          const photos = typeof docData.photos === 'string'
            ? [{ url: docData.photos }]
            : docData.photos || [];
          return { id: d.id, ...docData, photos, createdAtMs: ms };
        });
        data.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
        setListings(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching listings:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleViewMore = () => {
    if (!user) {
      router.push('/signin?redirect=/listings');
    } else {
      router.push('/listings');
    }
  };

  const handleListProperty = () => {
    if (!user) {
      router.push('/signin?redirect=/landlord-listings');
    } else {
      router.push('/landlord-listings');
    }
  };

  return (
    <section className="py-12 bg-color-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-royal-blue dark:text-color-white">
            Featured Properties
          </h2>
          <button
            onClick={handleListProperty}
            className="px-4 py-2 rounded-lg bg-royal-blue text-color-white hover:bg-bright-green transition-colors"
          >
            List a Property
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No properties available.{' '}
            <button
              onClick={handleListProperty}
              className="text-royal-blue dark:text-bright-green underline"
            >
              List a property
            </button>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                id={listing.id}
                title={listing.title || 'Untitled'}
                photo={listing.photos?.[0]?.url || ''}
                pricePerYear={parseFloat(listing.pricePerYear || '0')}
                locationArea={listing.locationArea || ''}
                state={listing.campus || ''}
                roomType={listing.roomType || ''}
                rating={parseFloat(listing.rating || '0')}
              />
            ))}
          </div>
        )}

        {listings.length >= 8 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleViewMore}
              className="px-6 py-3 rounded-lg bg-royal-blue text-color-white hover:bg-bright-green transition-colors"
            >
              View More Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
}