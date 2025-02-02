/// <reference types="vitest" />

import { describe, expect, beforeEach, test, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { MovieCard } from "@/components/organisms/MovieCard";
import { useStore } from "@/store";
// import { useNavigate } from "react-router-dom";
import { Movie } from "@/types/api.types";

// Mock navigate function
const mockNavigate = vi.fn();

// Create a mock store state that matches AppState interface
const createMockState = (watchlistItems: Movie[] = []) => ({
  filters: {},
  setFilters: vi.fn(),
  searchQuery: "",
  setSearchQuery: vi.fn(),
  favorites: [],
  toggleFavorite: vi.fn(),
  watchlist: watchlistItems,
  addToWatchlist: vi.fn(),
  removeFromWatchlist: vi.fn(),
  clearWatchlist: vi.fn(),
});

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Zustand store
vi.mock("@/store", () => ({
  useStore: vi.fn((selector) => selector(createMockState())),
}));

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  description: "Test description",
  overview: "Test overview",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  vote_average: 7.5,
  release_date: "2021-01-01",
  runtime: 120,
  adult: false,
  popularity: 100,
  video: false,
  streaming_sources: [],
};

describe("MovieCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe("rendering", () => {
    test("displays movie information correctly", () => {
      renderWithProviders(<MovieCard movie={mockMovie} />);

      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      const year = new Date(mockMovie.release_date).getFullYear().toString();
      expect(screen.getByText(year)).toBeInTheDocument();

      const poster = screen.getByAltText("Test Movie");
      expect(poster).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500/test-poster.jpg",
      );
    });

    test("shows watchlist button based on movie status", () => {
      vi.mocked(useStore).mockImplementation((selector) =>
        selector(createMockState()),
      );

      renderWithProviders(<MovieCard movie={mockMovie} />);
      expect(screen.getByTitle("Add to watchlist")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    test("clicking info button navigates to movie details", () => {
      renderWithProviders(<MovieCard movie={mockMovie} />);

      const infoButton = screen.getByTitle("View details");
      fireEvent.click(infoButton);

      expect(mockNavigate).toHaveBeenCalledWith(`/movie/${mockMovie.id}`);
    });

    test("clicking watchlist button adds movie to watchlist", () => {
      const mockAddToWatchlist = vi.fn();
      const mockState = createMockState();
      mockState.addToWatchlist = mockAddToWatchlist;

      vi.mocked(useStore).mockImplementation((selector) => selector(mockState));

      renderWithProviders(<MovieCard movie={mockMovie} />);

      const addButton = screen.getByTitle("Add to watchlist");
      fireEvent.click(addButton);

      expect(mockAddToWatchlist).toHaveBeenCalledWith(mockMovie);
    });

    test("clicking remove button removes movie from watchlist", () => {
      const mockRemoveFromWatchlist = vi.fn();
      const mockOnWatchlistRemove = vi.fn();
      const mockState = createMockState([mockMovie]);
      mockState.removeFromWatchlist = mockRemoveFromWatchlist;

      vi.mocked(useStore).mockImplementation((selector) => selector(mockState));

      renderWithProviders(
        <MovieCard
          movie={mockMovie}
          onWatchlistRemove={mockOnWatchlistRemove}
        />,
      );

      const removeButton = screen.getByTitle("Remove from watchlist");
      fireEvent.click(removeButton);

      expect(mockRemoveFromWatchlist).toHaveBeenCalledWith(mockMovie.id);
      expect(mockOnWatchlistRemove).toHaveBeenCalled();
    });
  });

  describe("hover behavior", () => {
    test("shows 'Add to watchlist' button when movie is not in watchlist", () => {
      vi.mocked(useStore).mockImplementation((selector) =>
        selector(createMockState()),
      );

      renderWithProviders(<MovieCard movie={mockMovie} />);
      const card = screen.getByTestId("movie-card");
      fireEvent.mouseEnter(card);

      expect(screen.getByTitle("View details")).toBeInTheDocument();
      expect(screen.getByTitle("Add to watchlist")).toBeInTheDocument();
    });

    test("shows 'Remove from watchlist' button when movie is in watchlist", () => {
      vi.mocked(useStore).mockImplementation((selector) =>
        selector(createMockState([mockMovie])),
      );

      renderWithProviders(<MovieCard movie={mockMovie} />);
      const card = screen.getByTestId("movie-card");
      fireEvent.mouseEnter(card);

      expect(screen.getByTitle("View details")).toBeInTheDocument();
      expect(screen.getByTitle("Remove from watchlist")).toBeInTheDocument();
    });

    test("buttons are visible after hover", () => {
      vi.mocked(useStore).mockImplementation((selector) =>
        selector(createMockState()),
      );

      renderWithProviders(<MovieCard movie={mockMovie} />);

      const card = screen.getByTestId("movie-card");
      fireEvent.mouseEnter(card);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);

      expect(screen.getByTitle("View details")).toBeVisible();
      expect(screen.getByTitle("Add to watchlist")).toBeVisible();
    });
  });
});
