import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatHash(hash: string) {
  return hash.substring(0, 10) + "..." + hash.substring(hash.length - 8, hash.length);
}