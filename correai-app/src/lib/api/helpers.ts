import { PostgrestError } from '@supabase/supabase-js';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Handles Supabase API errors and formats the response.
 * @param error - The PostgrestError from Supabase.
 * @param context - Optional context for the error message.
 * @returns Formatted error response.
 */
export function handleApiError<T>(
  error: PostgrestError | null,
  context?: string
): ApiResponse<T> {
  const errorMessage = context
    ? `Error ${context}: ${error?.message || 'Unknown error'}`
    : `API Error: ${error?.message || 'Unknown error'}`;

  console.error(errorMessage, error); // Log the detailed error
  return { data: null, error: errorMessage };
}

/**
 * Formats a successful API response.
 * @param data - The data payload.
 * @returns Formatted success response.
 */
export function handleApiSuccess<T>(data: T): ApiResponse<T> {
  return { data, error: null };
}
