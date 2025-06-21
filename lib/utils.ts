import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { JAM_COMMON_ERA_AFTER_UNIX_EPOCH, SLOT_PERIOD } from '@/lib/params';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  // Calculate the timestamp for this slot
  const slotTimestamp = JAM_COMMON_ERA_AFTER_UNIX_EPOCH + slot * SLOT_PERIOD;

  // Get current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Calculate seconds ago (if slot is in the past) or seconds until (if in the future)
  const secondsAgo = currentTimestamp - slotTimestamp;

  // If slot is in the future, return a different format
  if (secondsAgo < 0) {
    return `in ${timeAgo(Math.abs(secondsAgo))}`;
  }

  return timeAgo(secondsAgo);
}
