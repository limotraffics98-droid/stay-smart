import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { hotels, rooms } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Users,
  Download,
  Share2,
  Printer,
  ArrowRight,
} from 'lucide-react';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');
  const total = searchParams.get('total');

  const hotel = hotels.find((h) => h.id === hotelId);
  const room = rooms.find((r) => r.id === roomId);

  const checkIn = checkInStr ? parseISO(checkInStr) : null;
  const checkOut = checkOutStr ? parseISO(checkOutStr) : null;

  if (!hotel || !room || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Your reservation has been successfully made. We've sent a confirmation email with all the details.
              </p>
            </div>

            {/* Booking Reference Card */}
            <div className="bg-navy text-white rounded-2xl p-8 mb-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-white/70 mb-2">Booking Reference</p>
              <p className="text-3xl font-mono font-bold tracking-wider">{bookingId}</p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-card rounded-2xl shadow-card border overflow-hidden mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col md:flex-row">
                <img
                  src={hotel.mainImage}
                  alt={hotel.name}
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                />
                <div className="flex-1 p-6 space-y-4">
                  <div>
                    <span className="text-sm text-accent font-medium capitalize">
                      {hotel.propertyType}
                    </span>
                    <h2 className="font-display text-2xl font-semibold text-foreground mt-1">
                      {hotel.name}
                    </h2>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                      <MapPin className="w-4 h-4" />
                      {hotel.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                        <p className="font-medium text-foreground">
                          {format(checkIn, 'EEE, MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">From 3:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                        <p className="font-medium text-foreground">
                          {format(checkOut, 'EEE, MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">Until 11:00 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Room</p>
                        <p className="font-medium text-foreground">{room.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {room.bedType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="text-2xl font-bold text-foreground">${total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Voucher
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Details
              </Button>
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Print Confirmation
              </Button>
            </div>

            {/* Next Steps */}
            <div className="bg-muted/50 rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                What's Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Check your email</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with your booking details and voucher.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Prepare for your trip</p>
                    <p className="text-sm text-muted-foreground">
                      Review the hotel's policies and prepare any required documents for check-in.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Enjoy your stay!</p>
                    <p className="text-sm text-muted-foreground">
                      Present your booking confirmation at the hotel reception upon arrival.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button variant="gold" size="xl" asChild>
                <Link to="/my-bookings" className="gap-2">
                  View My Bookings
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
