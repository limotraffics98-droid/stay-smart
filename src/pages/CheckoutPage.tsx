import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { hotels, rooms } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format, differenceInDays, parseISO } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Shield,
  Clock,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const guestInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  specialRequests: z.string().optional(),
});

type GuestInfoFormData = z.infer<typeof guestInfoSchema>;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');

  const hotel = hotels.find((h) => h.id === hotelId);
  const room = rooms.find((r) => r.id === roomId);

  const checkIn = checkInStr ? parseISO(checkInStr) : null;
  const checkOut = checkOutStr ? parseISO(checkOutStr) : null;
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const form = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: '',
    },
  });

  if (!hotel || !room || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
          <p className="text-muted-foreground mb-6">
            Something went wrong with your booking details.
          </p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = room.pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.1);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + taxes + serviceFee;

  const onSubmit = async (data: GuestInfoFormData) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate booking reference
    const bookingRef = `SB${Date.now().toString(36).toUpperCase()}`;

    toast({
      title: 'Booking Confirmed!',
      description: `Your booking reference is ${bookingRef}`,
    });

    navigate(`/confirmation/${bookingRef}?hotelId=${hotelId}&roomId=${roomId}&checkIn=${checkInStr}&checkOut=${checkOutStr}&total=${total}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Hotel
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Guest Information Form */}
            <div className="lg:col-span-2">
              <h1 className="font-display text-3xl font-bold text-foreground mb-8">
                Complete Your Booking
              </h1>

              <div className="bg-card rounded-2xl p-8 shadow-card border mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Guest Information
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+1 (234) 567-8900"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Early check-in, high floor, etc."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Section Placeholder */}
                    <div className="border-t pt-6 mt-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-accent" />
                        Payment Details
                      </h3>
                      <div className="bg-muted/50 rounded-xl p-6 text-center">
                        <p className="text-muted-foreground mb-2">
                          Secure payment processing will be available after connecting Stripe.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          For now, bookings are confirmed without payment.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Confirm Booking — $${total}`
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Shield className="w-8 h-8 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Secure Booking</p>
                    <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Clock className="w-8 h-8 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Free Cancellation</p>
                    <p className="text-xs text-muted-foreground">Up to 24h before check-in</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Check className="w-8 h-8 text-accent" />
                  <div>
                    <p className="font-medium text-sm">Instant Confirmation</p>
                    <p className="text-xs text-muted-foreground">Receive details via email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl shadow-card border overflow-hidden">
                <img
                  src={hotel.mainImage}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm text-accent font-medium capitalize mb-1">
                      {hotel.propertyType}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                      <MapPin className="w-4 h-4" />
                      {hotel.city}
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {format(checkIn, 'EEE, MMM d')} → {format(checkOut, 'EEE, MMM d')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {nights} night{nights > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{room.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Up to {room.capacity} guests
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${room.pricePerNight} x {nights} night{nights > 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes (10%)</span>
                      <span className="font-medium">${taxes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span className="font-medium">${serviceFee}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-foreground">${total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
