const isBrowser = typeof window !== "undefined";

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) {
    return fallback;
  }

  try {
    const item = window.localStorage.getItem(key);

    if (!item) {
      return fallback;
    }

    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and serialization failures.
  }
}

export function removeStorage(key: string) {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage access issues.
  }
}
