import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Role } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  if(color === '#FFFFFF') {
    return getRandomColor();
  }
  return color;
}

export function decodeJWTPayload(token: string) {
  const payload = token.split('.')[1]; // phần giữa
  const decoded = atob(payload); // base64 decode
  return JSON.parse(decoded);
}


export async function urlToFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const contentType = blob.type || "image/jpeg";
  const fileName = url.split('/').pop() || "image.jpg"; // Lấy tên file từ URL
  return new File([blob],fileName, { type: contentType });
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function flattenObject(obj: Record<string, any>, prefix = ""): Record<string, any> {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : "";
    const value = obj[k];
    
    if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof File)) {
      Object.assign(acc, flattenObject(value, `${pre}${k}`));
    } else {
      acc[`${pre}${k}`] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}


export const getRoleWeight = (role: string) => {
  switch (role) {
    case "ADMIN":
      return Role.ADMIN.weight;
    case "STAFF":
      return Role.STAFF.weight;
    case "CUSTOMER":
      return Role.CUSTOMER.weight;
    default:
      return 0;
  }
}

export function computeIfAbsent<K, V>(
    map: Map<K, V>,
    key: K,
    defaultValue: V | (() => V)
): V {
  if (!map.has(key)) {
    const value = typeof defaultValue === 'function' ? (defaultValue as () => V)() : defaultValue;
    map.set(key, value);
  }
  return map.get(key)!;
}