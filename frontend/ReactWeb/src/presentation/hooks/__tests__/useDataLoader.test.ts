import { renderHook, waitFor } from '@testing-library/react';
import { useDataLoader } from '@/presentation/hooks/useDataLoader';

// Mock toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('useDataLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockLoader = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useDataLoader(mockLoader, [], { autoLoad: true })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(mockLoader).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to load');
    const mockLoader = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useDataLoader(mockLoader, [], { autoLoad: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Failed to load');
  });

  it('should not auto load when autoLoad is false', () => {
    const mockLoader = jest.fn();

    const { result } = renderHook(() =>
      useDataLoader(mockLoader, [], { autoLoad: false })
    );

    expect(result.current.loading).toBe(false);
    expect(mockLoader).not.toHaveBeenCalled();
  });

  it('should reload data when refresh is called', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockLoader = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useDataLoader(mockLoader, [], { autoLoad: false })
    );

    await result.current.refresh();

    expect(result.current.data).toEqual(mockData);
    expect(mockLoader).toHaveBeenCalledTimes(1);
  });

  it('should clear error when clearError is called', async () => {
    const mockError = new Error('Failed to load');
    const mockLoader = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useDataLoader(mockLoader, [], { autoLoad: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load');

    result.current.clearError();

    expect(result.current.error).toBe(null);
  });
});
