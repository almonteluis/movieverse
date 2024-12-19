import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SearchDialog } from '@/components/common/SearchDialog';
import { Bookmark, Film, Home, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';

const Navbar = () => {
  const location = useLocation();
  const watchlist = useStore((state) => state.watchlist);

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/watchlist', label: 'Watchlist', icon: Bookmark, count: watchlist.length },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">MovieVerse</span>
          </Link>
          <div className="flex items-center space-x-2">
            {links.map(({ to, label, icon: Icon, count }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('flex items-center gap-2', {
                      'bg-muted': isActive,
                    })}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    {count !== undefined && count > 0 && (
                      <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {count}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchDialog />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
