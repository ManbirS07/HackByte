import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  Search,
  User,
  Building2,
  LogIn,
  LogOut,
  UserCircle,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get the dashboard link based on user type
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.userType) {
      case 'volunteer':
        return '/volunteer-dashboard';
      case 'organization':
        return '/organization-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

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
            <span className="text-xl font-bold">Voluntree</span>
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
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
              {user ? (
                <>
                  <div className="py-2">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <Button size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to={getDashboardLink()}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
