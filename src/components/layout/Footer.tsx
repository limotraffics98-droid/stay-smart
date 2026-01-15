import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="font-display font-bold text-navy text-xl">S</span>
              </div>
              <span className="font-display text-2xl font-semibold">StayBook</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Discover extraordinary stays around the world. Book with confidence and create memories that last a lifetime.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Find Hotels
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-white/70 hover:text-accent text-sm transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/70 hover:text-accent text-sm transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-accent text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  123 Hotel Street, Suite 100<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+1234567890" className="text-white/70 hover:text-accent text-sm transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:hello@staybook.com" className="text-white/70 hover:text-accent text-sm transition-colors">
                  hello@staybook.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} StayBook. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/100px-PayPal.svg.png" alt="PayPal" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
