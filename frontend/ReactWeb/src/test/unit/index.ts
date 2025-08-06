// Service Tests
export * from '@/test/unit/services/AuthenticationService.test';
export * from '@/test/unit/services/LocalStorageCache.test';

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
