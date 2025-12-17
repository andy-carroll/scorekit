import '@testing-library/jest-dom';

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

function createInMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

if (
  typeof globalThis.localStorage === 'undefined' ||
  typeof (globalThis.localStorage as unknown as { clear?: unknown }).clear !== 'function'
) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createInMemoryStorage(),
    configurable: true,
  });
}
