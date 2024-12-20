import { describe, expect, beforeEach, vi, test } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { MovieCard } from "@/components/common/MovieCard";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { Movie } from "@/types/api.types";

// Mock navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock store
vi.mock("@/store", () => ({
  useStore: vi.fn(),
}));

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  description: "Test description",
  overview: "Test overview",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  vote_average: 7.5,
  release_date: "2022-01-01", // Changed to 2022 to match the actual output
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

    (useStore as vi.Mock).mockImplementation((selector) =>
      selector({
        watchlist: [],
        addToWatchlist: vi.fn(),
        removeFromWatchlist: vi.fn(),
      }),
    );
  });

  describe("rendering", () => {
    test("displays movie information correctly", () => {
      renderWithProviders(<MovieCard movie={mockMovie} />);

      // Check basic movie information is displayed
      expect(screen.getByText("Test Movie")).toBeInTheDocument();

      // Get the year from our mock data
      const year = new Date(mockMovie.release_date).getFullYear().toString();
      expect(screen.getByText(year)).toBeInTheDocument();

      // Check poster image
      const poster = screen.getByAltText("Test Movie");
      expect(poster).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500/test-poster.jpg",
      );
    });

    test("shows watchlist button based on movie status", () => {
      renderWithProviders(<MovieCard movie={mockMovie} />);
      expect(screen.getByTitle("Add to watchlist")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    test("clicking info button navigates to movie details", () => {
      renderWithProviders(<MovieCard movie={mockMovie} />);

      const infoButton = screen.getByTitle("View details");
      fireEvent.click(infoButton);

      // Prevent event default should have been called
      expect(mockNavigate).toHaveBeenCalledWith(`/movie/${mockMovie.id}`);
    });

    test("clicking watchlist button adds movie to watchlist", () => {
      const mockAddToWatchlist = vi.fn();

      (useStore as vi.Mock).mockImplementation((selector) =>
        selector({
          watchlist: [],
          addToWatchlist: mockAddToWatchlist,
          removeFromWatchlist: vi.fn(),
        }),
      );

      renderWithProviders(<MovieCard movie={mockMovie} />);

      const addButton = screen.getByTitle("Add to watchlist");
      fireEvent.click(addButton);

      expect(mockAddToWatchlist).toHaveBeenCalledWith(mockMovie);
    });

    test("clicking remove button removes movie from watchlist", () => {
      const mockRemoveFromWatchlist = vi.fn();
      const mockOnWatchlistRemove = vi.fn();

      (useStore as vi.Mock).mockImplementation((selector) =>
        selector({
          watchlist: [mockMovie],
          addToWatchlist: vi.fn(),
          removeFromWatchlist: mockRemoveFromWatchlist,
        }),
      );

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
    test("shows action buttons on hover", () => {
      renderWithProviders(<MovieCard movie={mockMovie} />);

      // Instead of looking for article role, use the card's class
      const card = screen.getByTestId("movie-card");
      fireEvent.mouseEnter(card);

      expect(screen.getByTitle("View details")).toBeInTheDocument();
      expect(screen.getByTitle("Add to watchlist")).toBeInTheDocument();
    });
  });
});
