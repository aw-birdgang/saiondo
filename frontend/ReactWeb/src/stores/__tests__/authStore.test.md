# AuthStore Test Cases

## Overview

This document outlines the test cases for the `authStore.ts` file. The tests cover authentication functionality including login, register, logout, and error handling.

## Test Setup Requirements

To run these tests, you'll need:

- Jest testing framework
- `@types/jest` for TypeScript support
- `@testing-library/react` for React component testing

## Test Cases

### Login Function Tests

#### ✅ Success Cases

1. **Valid Login Credentials**
   - Input: `email: 'test@example.com', password: 'password123'`
   - Expected: User authenticated, token stored, success toast shown
   - Assertions:
     - `isAuthenticated` should be `true`
     - `user` should be defined with correct email
     - `token` should be defined
     - `loading` should be `false`
     - `error` should be `null`
     - `localStorage.setItem` should be called with 'accessToken'

#### ❌ Error Cases

2. **Empty Email**
   - Input: `email: '', password: 'password123'`
   - Expected: Error thrown with message '유효한 이메일을 입력해주세요.'
   - Assertions:
     - `isAuthenticated` should be `false`
     - `loading` should be `false`
     - `error` should contain error message

3. **Null Email**
   - Input: `email: null, password: 'password123'`
   - Expected: Error thrown with message '유효한 이메일을 입력해주세요.'

4. **Empty Password**
   - Input: `email: 'test@example.com', password: ''`
   - Expected: Error thrown with message '유효한 비밀번호를 입력해주세요.'

5. **Short Password**
   - Input: `email: 'test@example.com', password: '123'`
   - Expected: Error thrown with message '비밀번호는 6자 이상이어야 합니다.'

6. **Invalid Email Format**
   - Input: `email: 'invalid-email', password: 'password123'`
   - Expected: Error thrown with message '유효한 이메일 형식을 입력해주세요.'

7. **Non-string Email**
   - Input: `email: 123, password: 'password123'`
   - Expected: Error thrown with message '유효한 이메일을 입력해주세요.'

8. **Non-string Password**
   - Input: `email: 'test@example.com', password: 123`
   - Expected: Error thrown with message '유효한 비밀번호를 입력해주세요.'

### Register Function Tests

#### ✅ Success Cases

9. **Valid Registration Data**
   - Input: `email: 'newuser@example.com', password: 'password123', username: 'newuser'`
   - Expected: User registered and authenticated
   - Assertions:
     - `isAuthenticated` should be `true`
     - `user` should be defined with correct email and username
     - `token` should be defined
     - `loading` should be `false`
     - `error` should be `null`

#### ❌ Error Cases

10. **Empty Username**
    - Input: `email: 'test@example.com', password: 'password123', username: ''`
    - Expected: Error thrown with message '유효한 사용자명을 입력해주세요.'

11. **Short Username**
    - Input: `email: 'test@example.com', password: 'password123', username: 'a'`
    - Expected: Error thrown with message '사용자명은 2자 이상이어야 합니다.'

12. **Whitespace-only Inputs**
    - Input: `email: '   ', password: '   ', username: '   '`
    - Expected: Error thrown with message '유효한 이메일을 입력해주세요.'

### Logout Function Tests

13. **Successful Logout**
    - Setup: Authenticated user state
    - Action: Call `logout()`
    - Expected: All auth data cleared
    - Assertions:
      - `user` should be `null`
      - `token` should be `null`
      - `isAuthenticated` should be `false`
      - `error` should be `null`
      - `localStorage.removeItem` should be called with 'accessToken'

### Clear Error Function Tests

14. **Clear Error State**
    - Setup: Error state set
    - Action: Call `clearError()`
    - Expected: Error cleared
    - Assertions:
      - `error` should be `null`

### Setter Function Tests

15. **Set User**
    - Action: Call `setUser(user)`
    - Expected: User state updated
    - Assertions:
      - `user` should equal input user object

16. **Set Token**
    - Action: Call `setToken(token)`
    - Expected: Token state updated
    - Assertions:
      - `token` should equal input token

17. **Set Loading**
    - Action: Call `setLoading(true)`
    - Expected: Loading state updated
    - Assertions:
      - `loading` should be `true`

18. **Set Error**
    - Action: Call `setError(error)`
    - Expected: Error state updated
    - Assertions:
      - `error` should equal input error

## Mock Requirements

### localStorage Mock

```javascript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

### Toast Mock

```javascript
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
```

## Test Environment Setup

```javascript
beforeEach(() => {
  // Clear store state before each test
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  // Clear all mocks
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up localStorage
  localStorageMock.clear();
});
```

## Running Tests

To run these tests, add the following to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^13.0.0"
  }
}
```

## Notes

- All tests should be isolated and not depend on each other
- Mock all external dependencies (localStorage, toast, API calls)
- Test both success and failure scenarios
- Include edge cases and null safety checks
- Verify state changes and side effects
