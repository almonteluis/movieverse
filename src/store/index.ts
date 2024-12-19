import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/types/api.types";

interface MovieFilters {
  genre?: number;
  year?: number;
  sortBy?: string;
}

interface AppState {
  filters: MovieFilters;
  setFilters: (filters: MovieFilters) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: number[];
  toggleFavorite: (movieId: number) => void;
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  clearWatchlist: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      filters: {},
      setFilters: (filters) => set({ filters }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      favorites: [],
      toggleFavorite: (movieId) =>
        set((state) => ({
          favorites: state.favorites.includes(movieId)
            ? state.favorites.filter((id) => id !== movieId)
            : [...state.favorites, movieId],
        })),
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => ({
          watchlist: state.watchlist.some((m) => m.id === movie.id)
            ? state.watchlist
            : [...state.watchlist, movie],
        })),
      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((movie) => movie.id !== movieId),
        })),
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    {
      name: "movieverse-storage",
    }
  )
);
