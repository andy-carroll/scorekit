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

const localStorageDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  'localStorage',
);

const shouldInstallInMemoryStorage =
  !localStorageDescriptor ||
  'get' in localStorageDescriptor ||
  typeof (localStorageDescriptor.value as { clear?: unknown } | undefined)?.clear !==
    'function';

if (shouldInstallInMemoryStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createInMemoryStorage(),
    configurable: true,
  });
}
