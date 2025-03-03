export function handleError(context: string, error: unknown): void {
  if (error instanceof Error) {
    // Handle specific error types:
    if (error.name === "AbortError") {
      console.info(`AbortError in ${context}: ${error.message}`);
      return; // You might choose to do nothing for aborts.
    }
    // Log other errors with their message.
    console.error(`Error in ${context}: ${error.message}`);
  } else {
    // Fallback for non-Error objects.
    console.error(`Unexpected error in ${context}:`, error);
  }
}
  
export function getErrorMessage (error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}