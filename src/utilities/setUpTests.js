import '@testing-library/jest-dom';
import 'text-encoding-utf-8';

// Mock fetch
global.fetch = jest.fn();

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GithubAuthProvider: jest.fn(() => {}),
  TwitterAuthProvider: jest.fn(() => {}),
  GoogleAuthProvider: jest.fn(() => {}),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  AuthContext: {
    Consumer: jest.fn(),
    Provider: jest.fn(),
  },
  useAuth: () => ({
    currentUser: null,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
    resetPassword: jest.fn(),
  }),
}));

// Setup ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};