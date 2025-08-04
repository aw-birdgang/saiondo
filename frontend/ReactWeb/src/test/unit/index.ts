// Service Tests
export * from './services/AuthenticationService.test';
export * from './services/LocalStorageCache.test';

// Test Utilities
export const createMockUseCase = <T>(returnValue: T) => ({
  execute: () => Promise.resolve(returnValue),
});

export const createMockRepository = <T>(returnValue: T) => ({
  findById: () => Promise.resolve(returnValue),
  save: () => Promise.resolve(returnValue),
  update: () => Promise.resolve(returnValue),
  delete: () => Promise.resolve(true),
}); 