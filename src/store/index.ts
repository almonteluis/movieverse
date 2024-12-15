import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    }),
    {
      name: "movieverse-storage",
    },
  ),
);
