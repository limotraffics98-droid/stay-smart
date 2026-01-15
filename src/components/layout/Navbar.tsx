import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(false); // Will be replaced with auth state

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparent ? 'bg-transparent' : 'bg-card/95 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="font-display font-bold text-navy text-xl">S</span>
            </div>
            <span className={cn(
              'font-display text-2xl font-semibold',
              transparent ? 'text-white' : 'text-foreground'
            )}>
              StayBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/search"
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                transparent ? 'text-white/90' : 'text-muted-foreground'
              )}
            >
              Explore Hotels
            </Link>
            <Link
              to="/destinations"
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                transparent ? 'text-white/90' : 'text-muted-foreground'
              )}
            >
              Destinations
            </Link>
            <Link
              to="/deals"
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                transparent ? 'text-white/90' : 'text-muted-foreground'
              )}
            >
              Deals
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={transparent ? 'hero-outline' : 'outline'} size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant={transparent ? 'hero-outline' : 'outline'}
                  size="sm"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  variant={transparent ? 'hero' : 'gold'}
                  size="sm"
                  asChild
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={cn('w-6 h-6', transparent ? 'text-white' : 'text-foreground')} />
            ) : (
              <Menu className={cn('w-6 h-6', transparent ? 'text-white' : 'text-foreground')} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-card border-b shadow-lg animate-slide-down">
            <div className="container px-4 py-6 space-y-4">
              <Link
                to="/search"
                className="block text-sm font-medium text-foreground hover:text-accent py-2"
                onClick={() => setIsOpen(false)}
              >
                Explore Hotels
              </Link>
              <Link
                to="/destinations"
                className="block text-sm font-medium text-foreground hover:text-accent py-2"
                onClick={() => setIsOpen(false)}
              >
                Destinations
              </Link>
              <Link
                to="/deals"
                className="block text-sm font-medium text-foreground hover:text-accent py-2"
                onClick={() => setIsOpen(false)}
              >
                Deals
              </Link>
              <div className="pt-4 border-t space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
                <Button variant="gold" className="w-full" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
