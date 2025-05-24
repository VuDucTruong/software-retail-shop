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

export function flattenObject(data: any): Record<string, any> {
  const record: Record<string, any> = {};

  const flatten = (value: any, keyPath?: string) => {
    if (value instanceof File || value instanceof Blob) {
      record[keyPath!] = value;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        flatten(item, `${keyPath}[${index}]`);
      });
    } else if (value !== null && typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        const newKey = keyPath ? `${keyPath}.${subKey}` : subKey;
        flatten(subValue, newKey);
      });
    } else if (value !== undefined && value !== null) {
      record[keyPath!] = value;
    }
  };

  flatten(data);
  return record;
}