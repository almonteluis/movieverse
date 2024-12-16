// src/services/tmdbService.ts
export const tmdbService = {
  getImageUrl: (path: string | null, size: string = "original") => {
    if (!path) return "/placeholder-image.jpg"; // Add a placeholder image
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  formatRuntime: (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  },

  formatDate: (dateString: string | null) => {
    if (!dateString) return "Release date unknown";
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Release date unknown";
  },
};
