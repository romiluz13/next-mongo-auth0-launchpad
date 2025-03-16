/**
 * Jest Setup
 * 
 * This file sets up the testing environment for Jest.
 */

// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock crypto for Auth0
const cryptoMock = {
  randomBytes: (size) => Buffer.alloc(size),
  createHash: () => ({
    update: () => ({
      digest: () => 'mocked-hash'
    })
  })
};
global.crypto = cryptoMock;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Auth0
jest.mock('@auth0/nextjs-auth0', () => ({
  getSession: jest.fn(() => null),
  withPageAuthRequired: jest.fn((component) => component),
  useUser: jest.fn(() => ({
    user: null,
    error: null,
    isLoading: false,
  })),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
    reset: jest.fn(),
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
}));

// Mock environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  MONGODB_URI: 'mongodb://localhost:27017/test',
};

// Global beforeEach
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Global afterEach
afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks();
});

// Global console overrides to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Filter out specific React errors that are expected in tests
  if (
    args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
    args[0]?.includes?.('Warning: useLayoutEffect does nothing on the server')
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Filter out specific warnings that are expected in tests
  if (
    args[0]?.includes?.('Warning: React does not recognize the') ||
    args[0]?.includes?.('Warning: The tag <')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Mock next/headers
jest.mock('next/headers', () => ({
  headers() {
    return new Headers();
  },
  cookies() {
    return new Map();
  },
}));

// Mock MongoDB
jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => Promise.resolve({
    connection: {
      db: {
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
          updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
          deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        }),
      },
    },
  })),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}; 