import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
