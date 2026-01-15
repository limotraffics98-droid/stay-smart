import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchForm } from '@/components/search/SearchForm';
import { HotelCard } from '@/components/hotel/HotelCard';
import { hotels, amenities } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SlidersHorizontal, X, Star, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const propertyTypes = ['hotel', 'resort', 'boutique', 'apartment', 'villa'];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const location = searchParams.get('location') || '';

  // Filter and sort hotels
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    // Filter by location
    if (location && location !== 'all') {
      result = result.filter((h) =>
        h.city.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by price
    result = result.filter(
      (h) => h.pricePerNight >= priceRange[0] && h.pricePerNight <= priceRange[1]
    );

    // Filter by rating
    if (selectedRating) {
      result = result.filter((h) => h.rating >= selectedRating);
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((h) =>
        selectedAmenities.every((a) => h.amenities.some((ha) => ha.name === a))
      );
    }

    // Filter by property type
    if (selectedPropertyTypes.length > 0) {
      result = result.filter((h) => selectedPropertyTypes.includes(h.propertyType));
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price_high':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [location, priceRange, selectedRating, selectedAmenities, selectedPropertyTypes, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedRating(null);
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
  };

  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < 1000 ||
    selectedRating !== null ||
    selectedAmenities.length > 0 ||
    selectedPropertyTypes.length > 0;

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000}
          step={10}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Guest Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                selectedRating === rating
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Star className={cn(
                'w-4 h-4',
                selectedRating === rating ? 'fill-current' : 'text-accent fill-accent'
              )} />
              {rating}+ rating
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Property Type</h4>
        <div className="space-y-3">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedPropertyTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPropertyTypes([...selectedPropertyTypes, type]);
                  } else {
                    setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type));
                  }
                }}
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold text-foreground mb-4">Amenities</h4>
        <div className="space-y-3">
          {amenities.slice(0, 8).map((amenity) => (
            <label key={amenity.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedAmenities.includes(amenity.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAmenities([...selectedAmenities, amenity.name]);
                  } else {
                    setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity.name));
                  }
                }}
              />
              <span className="text-sm">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Header */}
      <div className="bg-navy pt-28 pb-8">
        <div className="container mx-auto px-4">
          <SearchForm variant="compact" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {location && location !== 'all' ? (
                <>
                  <MapPin className="inline w-6 h-6 text-accent mr-2" />
                  Hotels in {location}
                </>
              ) : (
                'All Hotels'
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredHotels.length} properties found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-28 bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent" />
                Filters
              </h3>
              <FiltersContent />
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No hotels found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button variant="gold" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
