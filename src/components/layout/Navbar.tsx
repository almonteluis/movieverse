import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Menu,
  X,
  Bell,
  User,
  Heart,
  Film,
  Home,
  TrendingUp,
} from "lucide-react";

const navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6" />
          <span className="text-xl font-bold">MovieVerse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Movies
          </Link>
          <Link
            to="/trending"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Trending
          </Link>
          <Link
            to="/watchlist"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Watchlist
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 pb-3 pt-2">
            <Link
              to="/"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/movies"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Film className="h-4 w-4" />
              <span>Movies</span>
            </Link>
            <Link
              to="/trending"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </Link>
            <Link
              to="/watchlist"
              className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Heart className="h-4 w-4" />
              <span>Watchlist</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default navbar;
