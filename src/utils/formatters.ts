export const formatCurrency = {
  // Basic USD formatting with undefined check
  usd: (amount: number | undefined): string => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  // Compact format for large numbers with undefined check
  compact: (amount: number | undefined): string => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  },

  // Without cents with undefined check
  withoutCents: (amount: number | undefined): string => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  // Format with specific decimal places with undefined check
  withDecimals: (amount: number | undefined, decimals: number = 2): string => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  },
};
