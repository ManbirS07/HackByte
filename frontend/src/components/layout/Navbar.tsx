
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  Search,
  User,
  Building2,
  LogIn 
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-orange text-white p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 4 3 10 6 12 3-2 6-8 6-12Z"/>
                <circle cx="12" cy="8" r="2"/>
              </svg>
            </div>
            <span className="text-xl font-bold">Kindness Unite</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/events" className="text-sm font-medium hover:text-brand-orange transition-colors">
            Find Events
          </Link>
          <Link to="/organizations" className="text-sm font-medium hover:text-brand-orange transition-colors">
            Organizations
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-brand-orange transition-colors">
            About Us
          </Link>
        </nav>

        {/* Desktop Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container space-y-4">
            <Link 
              to="/events" 
              className="block py-2 hover:text-brand-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="inline h-4 w-4 mr-2" />
              Find Events
            </Link>
            <Link 
              to="/organizations" 
              className="block py-2 hover:text-brand-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Building2 className="inline h-4 w-4 mr-2" />
              Organizations
            </Link>
            <Link 
              to="/about" 
              className="block py-2 hover:text-brand-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <hr className="my-2" />
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
