import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Role} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberWithDots(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  if (color === "#FFFFFF") {
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
  const fileName = url.split("/").pop() || "image.jpg"; // Lấy tên file từ URL
  return new File([blob], fileName, { type: contentType });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
};

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

export class StringUtils {
    public static hasLength(str: string | null | undefined): boolean {
        return typeof str === 'string' && str.trim().length > 0;
    }
    public static isNum(value: unknown): value is string {
        return typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value));
    }
    public static isArray(value: unknown): value is unknown[] {
        return Array.isArray(value);
    }
}
export class CollectionUtils {
    public static isEmpty(arr: unknown[] | null | undefined): boolean {
        return !Array.isArray(arr) || arr.length === 0;
    }

    public static isNotEmpty<T>(arr: T[] | null | undefined): arr is T[] {
        return Array.isArray(arr) && arr.length > 0;
    }
}

// export function resolveStore<T, U>(
//   useStore: UseBoundStore<StoreApi<T>>,
//   selector: (store: T) => U
// ): [SetState<T>, GetState<T>, U] {
//   const selected = useStore(selector);
//   const setState = useStore.setState;
//   const getState = useStore.getState;
//   return [setState, getState, selected];
// }
export class HashSet {
    public static add<T>(
        current: readonly T[],
        item: T,
        keyExtractor: (v: T) => Primitives
    ): T[] {
        const keys = new Set(current.map(keyExtractor));
        if (!keys.has(keyExtractor(item))) {
            return [...current, item];
        }
        return [...current];
    }

    public static addAllReturnNew<T>(
        current: readonly T[],
        coming: readonly T[],
        keyExtractor: (v: T) => Primitives
    ): T[] {
        const keys = new Set(current.map(keyExtractor));
        const newItems = coming.filter(item => !keys.has(keyExtractor(item)));
        return [...current, ...newItems];
    }

    public static addAll<T>(
        current: T[],
        coming: readonly T[],
        keyExtractor: (v: T) => Primitives
    ): void {
        const keys = new Set(current.map(keyExtractor));
        for (const item of coming) {
            if (!keys.has(keyExtractor(item))) {
                current.push(item);
                keys.add(keyExtractor(item));
            }
        }
    }
}

export type Primitives = | string | number | boolean | null | undefined | symbol | bigint;


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

export const extractDataFromInnerAPI = async (res: Response) => {
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let message = "";
  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    message = message + chunk;
  }

  return message;
};



export function getOrCreateChatId(): string {
  let chatId = sessionStorage.getItem("chatId");
  if (!chatId) {
    chatId = crypto.randomUUID(); // hoặc uuidv4() nếu bạn đã cài uuid
    sessionStorage.setItem("chatId", chatId);
  }
  return chatId;
}