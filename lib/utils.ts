import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { notFound } from 'next/navigation';

import { JAM_COMMON_ERA_AFTER_UNIX_EPOCH, SLOT_PERIOD, EPOCH_LENGTH } from '@/lib/params';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Custom error class for network-related issues
 */
export class NetworkError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Check if error is a network/connectivity issue
 */
function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  
  const err = error as Record<string, unknown>;
  
  // Check for common network error patterns
  const networkErrorCodes = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET'];
  const networkErrorMessages = ['fetch failed', 'network error', 'connection refused'];
  
  // Check error code
  if (typeof err.code === 'string' && networkErrorCodes.includes(err.code)) {
    return true;
  }
  
  // Check error message
  if (typeof err.message === 'string') {
    const message = err.message.toLowerCase();
    if (networkErrorMessages.some(msg => message.includes(msg))) {
      return true;
    }
  }
  
  // Check error cause (for nested errors)
  if (err.cause && isNetworkError(err.cause)) {
    return true;
  }
  
  return false;
}

/**
 * Wraps an async operation and handles errors gracefully
 * Network errors throw NetworkError, other errors trigger notFound()
 */
export async function withNotFound<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    console.error(error);
    
    // If it's a network error, throw NetworkError for ErrorBoundary to catch
    if (isNetworkError(error)) {
      throw new NetworkError('Service temporarily unavailable', error);
    }
    
    // For other errors (like actual 404s), use notFound()
    notFound();
  }
}

/**
 * Truncate a string with customizable start and end lengths
 * @param str String to truncate
 * @param startLength Number of characters to keep at the start
 * @param endLength Number of characters to keep at the end
 * @param separator Separator string to use between start and end
 * @returns Truncated string or original if short enough
 */
export function truncateString(
  str: string, 
  startLength: number = 8, 
  endLength: number = 4, 
  separator: string = '...'
): string {
  if (!str) return '';
  if (str.length <= startLength + endLength) return str;
  return `${str.slice(0, startLength)}${separator}${str.slice(-endLength)}`;
}

export function formatHash(hash: string) {
  return truncateString(hash, 10, 8);
}

/**
 * Format bytes to human-readable format
 * @param bytes Number of bytes to format
 * @returns Formatted string with appropriate unit (Bytes, KB, MB, GB, TB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to format time ago
export function timeAgo(secondsAgo: number): string {
  if (secondsAgo < 60) return `${secondsAgo} sec ago`;
  const minutes = Math.floor(secondsAgo / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

/**
 * Calculate slot time and format as time ago string
 * @param slot The slot number to calculate time for
 * @returns Formatted time ago string based on slot time
 */
export function slotTime(slot: number): string {
  const slotTimestampUTC = JAM_COMMON_ERA_AFTER_UNIX_EPOCH + slot * SLOT_PERIOD;
  const currentTimestampUTC = Math.floor(Date.now() / 1000);
  const secondsAgo = currentTimestampUTC - slotTimestampUTC;

  if (secondsAgo < 0) {
    return `in ${timeAgo(Math.abs(secondsAgo))}`;
  }

  return timeAgo(secondsAgo);
}

/**
 * Calculate slot date and format as local date string
 * @param slot The slot number to calculate date for
 * @returns Formatted local date string based on slot time
 */
export function slotDate(slot: number): string {
  const slotTimestampUTC = JAM_COMMON_ERA_AFTER_UNIX_EPOCH + slot * SLOT_PERIOD;
  const slotDate = new Date(slotTimestampUTC * 1000);
  return slotDate.toLocaleString();
}

/**
 * Calculate the epoch number for a given slot
 * @param slot The slot number to calculate epoch for
 * @returns The epoch number
 */
export function calculateEpoch(slot: number): number {
  if (slot % EPOCH_LENGTH === 0) {
    return slot / EPOCH_LENGTH + 1;
  } else {
    return Math.floor(slot / EPOCH_LENGTH) + 1;
  }
}
