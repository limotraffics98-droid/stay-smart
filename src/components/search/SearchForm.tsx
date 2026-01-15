import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export function SearchForm({ variant = 'hero', className }: SearchFormProps) {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 3));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [guestsOpen, setGuestsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location: location || 'all',
      checkIn: checkIn ? format(checkIn, 'yyyy-MM-dd') : '',
      checkOut: checkOut ? format(checkOut, 'yyyy-MM-dd') : '',
      guests: String(guests.adults + guests.children),
      rooms: String(guests.rooms),
    });
    navigate(`/search?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        'w-full',
        isHero
          ? 'glass rounded-2xl p-2 shadow-xl'
          : 'bg-card rounded-xl border shadow-card p-2',
        className
      )}
    >
      <div className={cn(
        'grid gap-2',
        isHero
          ? 'grid-cols-1 md:grid-cols-[1fr,auto,auto,auto]'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}>
        {/* Location */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl',
          isHero ? 'bg-white/50' : 'bg-muted/50'
        )}>
          <MapPin className="w-5 h-5 text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Check In */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-left',
                isHero ? 'bg-white/50' : 'bg-muted/50'
              )}
            >
              <Calendar className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-medium text-muted-foreground mb-1">
                  Check In
                </span>
                <span className="block text-sm font-medium text-foreground truncate">
                  {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Select date'}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Check Out */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-left',
                isHero ? 'bg-white/50' : 'bg-muted/50'
              )}
            >
              <Calendar className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-medium text-muted-foreground mb-1">
                  Check Out
                </span>
                <span className="block text-sm font-medium text-foreground truncate">
                  {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Select date'}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date < (checkIn || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <div className="flex items-center gap-2">
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-left',
                  isHero ? 'bg-white/50' : 'bg-muted/50'
                )}
              >
                <Users className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-medium text-muted-foreground mb-1">
                    Guests
                  </span>
                  <span className="block text-sm font-medium text-foreground truncate">
                    {guests.adults + guests.children} guests, {guests.rooms} room{guests.rooms > 1 ? 's' : ''}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Adults</p>
                    <p className="text-xs text-muted-foreground">Ages 13+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{guests.adults}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => ({ ...g, adults: Math.min(10, g.adults + 1) }))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Children</p>
                    <p className="text-xs text-muted-foreground">Ages 0-12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => ({ ...g, children: Math.max(0, g.children - 1) }))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{guests.children}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => ({ ...g, children: Math.min(10, g.children + 1) }))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Rooms */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Rooms</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{guests.rooms}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => ({ ...g, rooms: Math.min(10, g.rooms + 1) }))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="gold"
                  className="w-full"
                  onClick={() => setGuestsOpen(false)}
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button type="submit" variant={isHero ? 'hero' : 'gold'} size={isHero ? 'xl' : 'lg'} className="shrink-0">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
