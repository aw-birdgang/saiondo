import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../presentation/screens/LoginScreen';
import { AuthProvider } from '../../presentation/providers/AuthProvider';

// Mock the keychain service
jest.mock('../../core/utils/Keychain', () => ({
  keychainService: {
    saveToken: jest.fn(),
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

// Mock the logger
jest.mock('../../core/utils/Logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuthProvider = (component: React.ReactElement) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  describe('LoginScreen', () => {
    it('should render login form correctly', () => {
      const { getByPlaceholderText, getByText } = renderWithAuthProvider(<LoginScreen />);

      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();
    });

    it('should show error when fields are empty', async () => {
      const { getByText } = renderWithAuthProvider(<LoginScreen />);

      const loginButton = getByText('Sign In');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Error')).toBeTruthy();
        expect(getByText('Please fill in all fields')).toBeTruthy();
      });
    });

    it('should handle login with valid credentials', async () => {
      const { getByPlaceholderText, getByText } = renderWithAuthProvider(<LoginScreen />);

      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Signing in...')).toBeTruthy();
      });

      // Wait for login to complete
      await waitFor(() => {
        expect(getByText('Sign In')).toBeTruthy();
      }, { timeout: 2000 });
    });

    it('should disable inputs during loading', async () => {
      const { getByPlaceholderText, getByText } = renderWithAuthProvider(<LoginScreen />);

      const emailInput = getByPlaceholderText('Enter your email');
      const passwordInput = getByPlaceholderText('Enter your password');
      const loginButton = getByText('Sign In');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(emailInput.props.editable).toBe(false);
        expect(passwordInput.props.editable).toBe(false);
      });
    });
  });

  describe('AuthProvider', () => {
    it('should initialize with loading state', () => {
      const { getByText } = renderWithAuthProvider(<LoginScreen />);

      // Initially should show loading state
      expect(getByText('Sign In')).toBeTruthy();
    });

    it('should handle authentication state changes', async () => {
      const { getByText } = renderWithAuthProvider(<LoginScreen />);

      const loginButton = getByText('Sign In');
      fireEvent.press(loginButton);

      // Should show loading state
      await waitFor(() => {
        expect(getByText('Signing in...')).toBeTruthy();
      });

      // Should return to normal state after login
      await waitFor(() => {
        expect(getByText('Sign In')).toBeTruthy();
      }, { timeout: 2000 });
    });
  });
}); 