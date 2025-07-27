/**
 * Result pattern for better error handling
 * Inspired by Rust's Result<T, E> type
 */

export interface Success<T> {
  data: T;
  error: null;
  success: true;
}

export interface Failure<E = Error> {
  data: null;
  error: E;
  success: false;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Create a successful result
 */
export function ok<T>(data: T): Success<T> {
  return {
    data,
    error: null,
    success: true,
  };
}

/**
 * Create a failed result
 */
export function err<E = Error>(error: E): Failure<E> {
  return {
    data: null,
    error,
    success: false,
  };
}

/**
 * Wrap an async function to return Result instead of throwing
 */
export async function safeAsync<T, E = Error>(
  fn: () => Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await fn();
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
}

/**
 * Wrap a sync function to return Result instead of throwing
 */
export function safe<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const data = fn();
    return ok(data);
  } catch (error) {
    return err(error as E);
  }
}