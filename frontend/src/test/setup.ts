import '@testing-library/jest-dom';

// ---------------------------------------------------------------------------
// localStorage mock
// Provides a simple in-memory localStorage for tests running in JSDOM.
// ---------------------------------------------------------------------------
const localStorageData: Record<string, string> = {};

const localStorageMock: Storage = {
  getItem: (key) => localStorageData[key] ?? null,
  setItem: (key, value) => { localStorageData[key] = value; },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach((k) => delete localStorageData[k]); },
  key: (index) => Object.keys(localStorageData)[index] ?? null,
  get length() { return Object.keys(localStorageData).length; },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// ---------------------------------------------------------------------------
// Notification API mock — not available in JSDOM by default
// ---------------------------------------------------------------------------
if (!('Notification' in globalThis)) {
  Object.defineProperty(globalThis, 'Notification', {
    value: class Notification {
      static permission: NotificationPermission = 'default';
      static requestPermission = async (): Promise<NotificationPermission> => 'default';
    },
    writable: true,
    configurable: true,
  });
}

// ---------------------------------------------------------------------------
// serviceWorker mock — not available in JSDOM by default
// ---------------------------------------------------------------------------
if (!('serviceWorker' in navigator)) {
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      ready: Promise.resolve({
        pushManager: {
          subscribe: async () => ({}),
          getSubscription: async () => null,
        },
      }),
    },
    writable: true,
    configurable: true,
  });
}

// ---------------------------------------------------------------------------
// matchMedia mock — not available in JSDOM by default
// ---------------------------------------------------------------------------
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
