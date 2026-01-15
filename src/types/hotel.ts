export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  mainImage: string;
  images: string[];
  amenities: Amenity[];
  pricePerNight: number;
  propertyType: 'hotel' | 'resort' | 'boutique' | 'apartment' | 'villa';
  featured?: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  roomType: 'standard' | 'deluxe' | 'suite' | 'penthouse';
  description: string;
  capacity: number;
  bedType: string;
  size: number; // in sqm
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
  images: string[];
  amenities: string[];
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  hotel?: Hotel;
  room?: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomsCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
  guestInfo: GuestInfo;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  hotelId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SearchFilters {
  city?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  amenities?: string[];
  propertyTypes?: string[];
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'popularity';
}

export interface PriceBreakdown {
  nightlyRate: number;
  nights: number;
  subtotal: number;
  taxes: number;
  serviceFee: number;
  discount?: number;
  total: number;
}
