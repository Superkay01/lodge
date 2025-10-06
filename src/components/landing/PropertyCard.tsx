
'use client';

import Image from 'next/image';
import Link from 'next/link';

type PropertyCardProps = {
  id: string;
  title: string;
  photo: string;
  pricePerYear: number; // Converted from string in ListingsSection
  locationArea: string;
  state: string; // Using campus
  roomType: string;
  rating: number; // Converted from string or undefined
};

export default function PropertyCard({
  id,
  title,
  photo,
  pricePerYear,
  locationArea,
  state,
  roomType,
  rating,
}: PropertyCardProps) {
  const thumb = photo.includes('/upload/')
    ? photo.replace('/upload/', '/upload/c_fill,w_300,h_200,q_auto,f_auto/')
    : photo;

  return (
    <Link href={`/listings/${id}`} className="block">
      <div className="rounded-lg overflow-hidden shadow-lg bg-color-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
        <div className="relative w-full h-48">
          {thumb ? (
            <Image
              src={thumb}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-royal-blue dark:text-color-white truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {locationArea}{state ? `, ${state}` : ''} · {roomType || 'Room'}
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-color-white">
            ₦{pricePerYear.toLocaleString()} / year
          </p>
          <div className="flex mt-2">
            <span className="text-yellow-500">{'★'.repeat(Math.round(rating))}</span>
            <span className="text-gray-300">{'★'.repeat(5 - Math.round(rating))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}