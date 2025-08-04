import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageCache } from '../../../infrastructure/cache/LocalStorageCache';

describe('LocalStorageCache', () => {
  let cache: LocalStorageCache;
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    cache = new LocalStorageCache({ prefix: 'test_cache_' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('set', () => {
    it('should store data with default TTL', () => {
      // Arrange
      const key = 'test_key';
      const value = { data: 'test_value' };

      // Act
      cache.set(key, value);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test_cache_test_key',
        expect.stringContaining('"value":{"data":"test_value"}')
      );
    });

    it('should store data with custom TTL', () => {
      // Arrange
      const key = 'test_key';
      const value = { data: 'test_value' };
      const customTTL = 5000; // 5 seconds

      // Act
      cache.set(key, value, customTTL);

      // Assert
      const storedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(storedData.ttl).toBe(customTTL);
    });

    it('should handle storage errors gracefully', () => {
      // Arrange
      const key = 'test_key';
      const value = { data: 'test_value' };
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Act & Assert
      expect(() => cache.set(key, value)).not.toThrow();
    });
  });

  describe('get', () => {
    it('should retrieve valid data', () => {
      // Arrange
      const key = 'test_key';
      const value = { data: 'test_value' };
      const storedData = {
        value,
        timestamp: Date.now(),
        ttl: 3600000, // 1 hour
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      // Act
      const result = cache.get(key);

      // Assert
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test_cache_test_key');
      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      // Arrange
      const key = 'non_existent_key';
      mockLocalStorage.getItem.mockReturnValue(null);

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for expired data', () => {
      // Arrange
      const key = 'expired_key';
      const storedData = {
        value: { data: 'expired_value' },
        timestamp: Date.now() - 7200000, // 2 hours ago
        ttl: 3600000, // 1 hour TTL
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test_cache_expired_key');
    });

    it('should handle JSON parse errors gracefully', () => {
      // Arrange
      const key = 'invalid_key';
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      // Act
      const result = cache.get(key);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should remove data from storage', () => {
      // Arrange
      const key = 'test_key';

      // Act
      cache.delete(key);

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test_cache_test_key');
    });

    it('should handle removal errors gracefully', () => {
      // Arrange
      const key = 'test_key';
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Act & Assert
      expect(() => cache.delete(key)).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      // Arrange
      const keys = ['test_cache_key1', 'test_cache_key2', 'other_key'];
      Object.defineProperty(mockLocalStorage, 'key', {
        value: (index: number) => keys[index],
        writable: true,
      });
      Object.defineProperty(mockLocalStorage, 'length', {
        value: keys.length,
        writable: true,
      });

      // Act
      cache.clear();

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test_cache_key1');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test_cache_key2');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('other_key');
    });
  });

  describe('has', () => {
    it('should return true for existing valid data', () => {
      // Arrange
      const key = 'test_key';
      const storedData = {
        value: { data: 'test_value' },
        timestamp: Date.now(),
        ttl: 3600000,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for non-existent key', () => {
      // Arrange
      const key = 'non_existent_key';
      mockLocalStorage.getItem.mockReturnValue(null);

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for expired data', () => {
      // Arrange
      const key = 'expired_key';
      const storedData = {
        value: { data: 'expired_value' },
        timestamp: Date.now() - 7200000,
        ttl: 3600000,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      // Act
      const result = cache.has(key);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('size', () => {
    it('should return correct cache size', () => {
      // Arrange
      const keys = ['test_cache_key1', 'test_cache_key2', 'other_key'];
      Object.defineProperty(mockLocalStorage, 'key', {
        value: (index: number) => keys[index],
        writable: true,
      });
      Object.defineProperty(mockLocalStorage, 'length', {
        value: keys.length,
        writable: true,
      });

      // Act
      const result = cache.size();

      // Assert
      expect(result).toBe(2); // Only cache keys, not other_key
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', () => {
      // Arrange
      const keys = ['test_cache_valid', 'test_cache_expired'];
      const validData = {
        value: { data: 'valid' },
        timestamp: Date.now(),
        ttl: 3600000,
      };
      const expiredData = {
        value: { data: 'expired' },
        timestamp: Date.now() - 7200000,
        ttl: 3600000,
      };

      Object.defineProperty(mockLocalStorage, 'key', {
        value: (index: number) => keys[index],
        writable: true,
      });
      Object.defineProperty(mockLocalStorage, 'length', {
        value: keys.length,
        writable: true,
      });

      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify(validData))
        .mockReturnValueOnce(JSON.stringify(expiredData));

      // Act
      cache.cleanup();

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test_cache_expired');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('test_cache_valid');
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      // Arrange
      const keys = ['test_cache_valid', 'test_cache_expired'];
      const validData = {
        value: { data: 'valid' },
        timestamp: Date.now(),
        ttl: 3600000,
      };
      const expiredData = {
        value: { data: 'expired' },
        timestamp: Date.now() - 7200000,
        ttl: 3600000,
      };

      Object.defineProperty(mockLocalStorage, 'key', {
        value: (index: number) => keys[index],
        writable: true,
      });
      Object.defineProperty(mockLocalStorage, 'length', {
        value: keys.length,
        writable: true,
      });

      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify(validData))
        .mockReturnValueOnce(JSON.stringify(expiredData));

      // Act
      const stats = cache.getStats();

      // Assert
      expect(stats.totalItems).toBe(2);
      expect(stats.validItems).toBe(1);
      expect(stats.expiredItems).toBe(1);
      expect(stats.totalSize).toBeGreaterThan(0);
    });
  });
}); 