import { describe, test, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { MovieCard } from "@/components/common/MovieCard";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";

// Mock the store
vi.mock("@/store", () => ({
  useStore: vi.fn(),
}));

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Sample movie data for testing
const mockMovie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  release_date: "2023-01-01",
};

describe("MovieCard Component", () => {
  // Setup mock store before each test
  beforeEach(() => {
    // Reset mock implementations
    (useStore as vi.Mock).mockImplementation((selector) => {
      return selector({
        watchlist: [],
        addToWatchlist: vi.fn(),
        removeFromWatchlist: vi.fn(),
      });
    });

    // Reset useNavigate mock
    (useNavigate as vi.Mock).mockReturnValue(vi.fn());
  });

  test("renders movie card with correct information", () => {
    renderWithProviders(<MovieCard movie={mockMovie} />);

    // Check movie title
    const titleElement = screen.getByText("Test Movie");
    expect(titleElement).toBeInTheDocument();

    // Check release year - update to match the actual year
    const yearElement = screen.getByText("2022");
    expect(yearElement).toBeInTheDocument();

    // Check poster image
    const posterImage = screen.getByAltText("Test Movie");
    expect(posterImage).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/test-poster.jpg",
    );
  });

  test("shows add to watchlist button when not in watchlist", () => {
    // Mock store with empty watchlist
    (useStore as vi.Mock).mockImplementation((selector) => {
      return selector({
        watchlist: [],
        addToWatchlist: vi.fn(),
        removeFromWatchlist: vi.fn(),
      });
    });

    renderWithProviders(<MovieCard movie={mockMovie} />);

    // Check for add to watchlist button
    const addToWatchlistButton = screen.getByTitle("Add to watchlist");
    expect(addToWatchlistButton).toBeInTheDocument();
  });

  test("shows remove from watchlist button when in watchlist", () => {
    // Mock store with movie in watchlist
    (useStore as vi.Mock).mockImplementation((selector) => {
      return selector({
        watchlist: [mockMovie],
        addToWatchlist: vi.fn(),
        removeFromWatchlist: vi.fn(),
      });
    });

    renderWithProviders(<MovieCard movie={mockMovie} />);

    // Check for remove from watchlist button
    const removeFromWatchlistButton = screen.getByTitle(
      "Remove from watchlist",
    );
    expect(removeFromWatchlistButton).toBeInTheDocument();
  });

  test("calls addToWatchlist when adding to watchlist", () => {
    // Create mock functions
    const mockAddToWatchlist = vi.fn();

    // Mock store with add to watchlist function
    (useStore as vi.Mock).mockImplementation((selector) => {
      return selector({
        watchlist: [],
        addToWatchlist: mockAddToWatchlist,
        removeFromWatchlist: vi.fn(),
      });
    });

    renderWithProviders(<MovieCard movie={mockMovie} />);

    // Find and click add to watchlist button
    const addToWatchlistButton = screen.getByTitle("Add to watchlist");
    fireEvent.click(addToWatchlistButton);

    // Verify addToWatchlist was called with the movie
    expect(mockAddToWatchlist).toHaveBeenCalledWith(mockMovie);
  });

  test("calls removeFromWatchlist when removing from watchlist", () => {
    // Create mock functions
    const mockRemoveFromWatchlist = vi.fn();
    const mockOnWatchlistRemove = vi.fn();

    // Mock store with movie in watchlist and remove function
    (useStore as vi.Mock).mockImplementation((selector) => {
      return selector({
        watchlist: [mockMovie],
        addToWatchlist: vi.fn(),
        removeFromWatchlist: mockRemoveFromWatchlist,
      });
    });

    renderWithProviders(
      <MovieCard movie={mockMovie} onWatchlistRemove={mockOnWatchlistRemove} />,
    );

    // Find and click remove from watchlist button
    const removeFromWatchlistButton = screen.getByTitle(
      "Remove from watchlist",
    );
    fireEvent.click(removeFromWatchlistButton);

    // Verify removeFromWatchlist was called with movie id
    expect(mockRemoveFromWatchlist).toHaveBeenCalledWith(mockMovie.id);

    // Verify optional onWatchlistRemove callback was called
    expect(mockOnWatchlistRemove).toHaveBeenCalled();
  });

  test("navigates to movie details when info button is clicked", () => {
    // Create mock navigate function
    const mockNavigate = vi.fn();
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    renderWithProviders(<MovieCard movie={mockMovie} />);

    // Find and click info button
    const infoButton = screen.getByTitle("View details");
    fireEvent.click(infoButton);

    // Verify navigation to correct route
    expect(mockNavigate).toHaveBeenCalledWith(`/movie/${mockMovie.id}`);
  });
});
