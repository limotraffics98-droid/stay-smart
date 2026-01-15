import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DestinationCardProps {
  city: string;
  country: string;
  image: string;
  hotelCount: number;
}

export function DestinationCard({ city, country, image, hotelCount }: DestinationCardProps) {
  return (
    <Link
      to={`/search?location=${city}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/5] shadow-card hover:shadow-xl transition-all duration-300"
    >
      <img
        src={image}
        alt={city}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl font-semibold text-white mb-1 group-hover:text-accent transition-colors">
          {city}
        </h3>
        <p className="text-white/70 text-sm mb-3">{country}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-sm">
            {hotelCount.toLocaleString()} properties
          </span>
          <span className="flex items-center gap-1 text-accent text-sm font-medium opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Explore <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
