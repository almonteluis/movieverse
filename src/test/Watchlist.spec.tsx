import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Watchlist from "../pages/watchlist";
import { useStore } from "../store";
import { useWatchlistStreaming } from "../hooks/useWatchlistStreaming";

// Mock the hooks
vi.mock("../store");
vi.mock("../hooks/useWatchlistStreaming");

const mockMovie = {
  id: 157336,
  title: "Interstellar",
  overview:
    "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  poster_path: "/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg",
  backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
  vote_average: 8.4,
  release_date: "2014-11-05",
  runtime: 169,
  adult: false,
  popularity: 123.456,
  video: false,
};

// Wrapper component with Router
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Watchlist", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("should render movies with unique keys across streaming services", () => {
    // Mock the store with a movie that appears in multiple streaming services
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          watchlist: [mockMovie],
          clearWatchlist: vi.fn(),
        }),
    );

    // Mock the streaming hook to return the same movie in multiple services
    (
      useWatchlistStreaming as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      loading: false,
      error: null,
      moviesByService: {
        Netflix: [mockMovie],
        Hulu: [mockMovie],
        "Prime Video": [mockMovie],
      },
    });

    // Create a spy for console.error to catch duplicate key warnings
    const consoleSpy = vi.spyOn(console, "error");

    renderWithRouter(<Watchlist />);

    // Check if there were no duplicate key warnings
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Encountered two children with the same key"),
    );

    // Clean up
    consoleSpy.mockRestore();
  });

  it("should show loading state", () => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          watchlist: [mockMovie],
          clearWatchlist: vi.fn(),
        }),
    );

    (
      useWatchlistStreaming as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      loading: true,
      error: null,
      moviesByService: {},
    });

    renderWithRouter(<Watchlist />);
    expect(
      screen.getByText("Fetching streaming information..."),
    ).toBeInTheDocument();
  });

  it("should show error state", () => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          watchlist: [mockMovie],
          clearWatchlist: vi.fn(),
        }),
    );

    const errorMessage = "Failed to fetch streaming information";
    (
      useWatchlistStreaming as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      loading: false,
      error: errorMessage,
      moviesByService: {},
    });

    renderWithRouter(<Watchlist />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should show empty watchlist message", () => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          watchlist: [],
          clearWatchlist: vi.fn(),
        }),
    );

    renderWithRouter(<Watchlist />);
    expect(screen.getByText("Your watchlist is empty")).toBeInTheDocument();
  });

  it("should render streaming service sections with icons", () => {
    (useStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          watchlist: [mockMovie],
          clearWatchlist: vi.fn(),
        }),
    );

    (
      useWatchlistStreaming as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      loading: false,
      error: null,
      moviesByService: {
        Netflix: [mockMovie],
        "Not Available": [{ ...mockMovie, id: 157337 }],
      },
    });

    renderWithRouter(<Watchlist />);

    // Check for Netflix section
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByAltText("Netflix")).toBeInTheDocument();

    // Check for Not Available section
    expect(screen.getByText("Not Available")).toBeInTheDocument();
  });
});
