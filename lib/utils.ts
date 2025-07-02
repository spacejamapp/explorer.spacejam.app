import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { notFound } from 'next/navigation';

import { JAM_COMMON_ERA_AFTER_UNIX_EPOCH, SLOT_PERIOD } from '@/lib/params';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Wraps an async operation and converts any errors to notFound() calls
 * This prevents server errors from crashing the page and provides graceful error handling
 */
export async function withNotFound<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export function formatHash(hash: string) {
  return (
    hash.substring(0, 10) + '...' + hash.substring(hash.length - 8, hash.length)
  );
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
