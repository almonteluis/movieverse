import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorMessage({
  message = "Something went wrong",
  retry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <p className="text-lg font-semibold text-destructive">{message}</p>
      {retry && (
        <Button variant="outline" onClick={retry} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
