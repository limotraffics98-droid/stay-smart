import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { hotels, rooms, reviews } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays, addDays } from 'date-fns';
import {
  Star,
  MapPin,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users,
  Maximize2,
  Check,
  Calendar as CalendarIcon,
  Share2,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Restaurant': <UtensilsCrossed className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  'Gym': <Dumbbell className="w-5 h-5" />,
  'Spa': <Sparkles className="w-5 h-5" />,
};

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 3));
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const hotel = hotels.find((h) => h.id === id);
  const hotelRooms = rooms.filter((r) => r.hotelId === id);
  const hotelReviews = reviews.filter((r) => r.hotelId === id);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Hotel not found</p>
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const selectedRoomData = hotelRooms.find((r) => r.id === selectedRoom);

  const handleBooking = () => {
    if (selectedRoom && checkIn && checkOut) {
      navigate(`/checkout?hotelId=${id}&roomId=${selectedRoom}&checkIn=${format(checkIn, 'yyyy-MM-dd')}&checkOut=${format(checkOut, 'yyyy-MM-dd')}`);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Image Gallery */}
      <section className="pt-20">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={hotel.images[currentImageIndex]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Gallery Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {hotel.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                )}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-accent mb-2">
                <span className="px-3 py-1 bg-accent/10 rounded-full text-sm font-medium capitalize">
                  {hotel.propertyType}
                </span>
                {hotel.featured && (
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {hotel.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{hotel.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 rounded-lg">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold text-foreground">{hotel.rating}</span>
                  </div>
                  <span>({hotel.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                About This Hotel
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      {amenityIcons[amenity.name] || <Check className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-foreground">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Available Rooms
              </h2>
              <div className="space-y-4">
                {hotelRooms.map((room) => (
                  <div
                    key={room.id}
                    className={cn(
                      'border rounded-2xl overflow-hidden transition-all',
                      selectedRoom === room.id
                        ? 'border-accent ring-2 ring-accent/20'
                        : 'border-border hover:border-accent/50'
                    )}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-auto">
                        <img
                          src={room.images[0]}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="text-xs font-medium text-accent uppercase tracking-wider">
                              {room.roomType}
                            </span>
                            <h3 className="font-display text-xl font-semibold text-foreground mt-1">
                              {room.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">
                              ${room.pricePerNight}
                            </p>
                            <p className="text-sm text-muted-foreground">per night</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                          {room.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            Up to {room.capacity} guests
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Maximize2 className="w-4 h-4" />
                            {room.size} m²
                          </div>
                          <span className="text-sm text-muted-foreground">{room.bedType}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities.slice(0, 4).map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            'text-sm font-medium',
                            room.availableRooms <= 3 ? 'text-destructive' : 'text-success'
                          )}>
                            {room.availableRooms <= 3
                              ? `Only ${room.availableRooms} left!`
                              : `${room.availableRooms} rooms available`}
                          </span>
                          <Button
                            variant={selectedRoom === room.id ? 'gold' : 'outline'}
                            onClick={() => setSelectedRoom(room.id)}
                          >
                            {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Guest Reviews
              </h2>
              <div className="space-y-6">
                {hotelReviews.map((review) => (
                  <div key={review.id} className="p-6 bg-muted/50 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.userAvatar || '/placeholder.svg'}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{review.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  i < review.rating
                                    ? 'text-accent fill-accent'
                                    : 'text-muted-foreground'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-2xl p-6 shadow-card border">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  ${selectedRoomData?.pricePerNight || hotel.pricePerNight}
                </span>
                <span className="text-muted-foreground">/ night</span>
              </div>

              <div className="space-y-4 mb-6">
                {/* Check-in */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-in
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl text-left">
                        <CalendarIcon className="w-5 h-5 text-accent" />
                        <span className="font-medium">
                          {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Select date'}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-out
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl text-left">
                        <CalendarIcon className="w-5 h-5 text-accent" />
                        <span className="font-medium">
                          {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Select date'}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date < (checkIn || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Price Breakdown */}
              {selectedRoom && nights > 0 && (
                <div className="border-t pt-6 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${selectedRoomData?.pricePerNight} x {nights} night{nights > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium">
                      ${(selectedRoomData?.pricePerNight || 0) * nights}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span className="font-medium">
                      ${Math.round((selectedRoomData?.pricePerNight || 0) * nights * 0.12)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">
                      ${Math.round((selectedRoomData?.pricePerNight || 0) * nights * 1.12)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                variant="hero"
                className="w-full"
                size="xl"
                disabled={!selectedRoom || !checkIn || !checkOut}
                onClick={handleBooking}
              >
                {!selectedRoom
                  ? 'Select a Room'
                  : !checkIn || !checkOut
                  ? 'Select Dates'
                  : 'Book Now'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
