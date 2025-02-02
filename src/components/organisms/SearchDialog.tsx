import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { query, setQuery } = useSearch();
  const debouncedQuery = useDebounce(query, 300);

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(debouncedQuery.trim())}`, {
        replace: true,
      });
    }
  }, [debouncedQuery, navigate]);

  // Initialize query from URL search param
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams, setQuery]);

  // Close dialog when navigating away
  useEffect(() => {
    return () => setOpen(false);
  }, []);

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search movies"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
