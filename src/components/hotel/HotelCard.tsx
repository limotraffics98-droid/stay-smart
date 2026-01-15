import { Link } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { Hotel } from '@/types/hotel';
import { cn } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function HotelCard({ hotel, variant = 'default', className }: HotelCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <Link
      to={`/hotel/${hotel.id}`}
      className={cn(
        'group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300',
        isFeatured && 'md:flex md:h-[280px]',
        className
      )}
    >
      {/* Image */}
      <div className={cn(
        'relative overflow-hidden',
        isFeatured ? 'md:w-[45%]' : 'aspect-[4/3]',
        isCompact && 'aspect-[3/2]'
      )}>
        <img
          src={hotel.mainImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            // Handle favorite
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
        >
          <Heart className="w-5 h-5 text-foreground" />
        </button>

        {/* Featured Badge */}
        {hotel.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full shadow-gold">
            Featured
          </div>
        )}

        {/* Property Type */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full capitalize">
          {hotel.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'p-5',
        isFeatured && 'md:flex-1 md:p-6 md:flex md:flex-col md:justify-between'
      )}>
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{hotel.city}</span>
          </div>

          {/* Name */}
          <h3 className={cn(
            'font-display font-semibold text-foreground group-hover:text-accent transition-colors',
            isFeatured ? 'text-xl mb-3' : 'text-lg mb-2',
            isCompact && 'text-base'
          )}>
            {hotel.name}
          </h3>

          {/* Description (featured only) */}
          {isFeatured && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {hotel.description}
            </p>
          )}

          {/* Amenities Preview */}
          {!isCompact && (
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity.id}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                >
                  {amenity.name}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                  +{hotel.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-lg">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-semibold text-foreground">{hotel.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({hotel.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-foreground">
              ${hotel.pricePerNight}
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
