import axios from "axios";

export class ApplicationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export const handleError = (error: unknown): ApplicationError => {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new ApplicationError(
      error.response?.data?.message || error.message,
      error.response?.status,
      "API_ERROR"
    );
  }

  if (error instanceof Error) {
    return new ApplicationError(error.message, 500, "UNKNOWN_ERROR");
  }

  return new ApplicationError(
    "An unknown error occurred",
    500,
    "UNKNOWN_ERROR"
  );
};
