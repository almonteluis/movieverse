import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useStore } from '@/store';

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search movies...
        </button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only">Search Movies</DialogTitle>
        <DialogDescription className="sr-only">
          Search for movies by entering a title
        </DialogDescription>
        <div className="p-4">
          <Input
            type="search"
            placeholder="Search movies..."
            className="h-10"
            autoFocus
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search movies"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
