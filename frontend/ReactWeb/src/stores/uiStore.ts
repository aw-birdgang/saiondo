import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: Date;
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: unknown;
}

export interface UIState {
  // State
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  modals: Record<string, ModalState>;
  loadingStates: Record<string, boolean>;
  errors: Record<string, string | null>;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (type: string, data?: unknown) => void;
  closeModal: (type: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  // Initial state
  sidebarOpen: false,
  mobileMenuOpen: false,
  notifications: [],
  modals: {},
  loadingStates: {},
  errors: {},

  // Actions
  setSidebarOpen: open => set({ sidebarOpen: open }),
  setMobileMenuOpen: open => set({ mobileMenuOpen: open }),

  addNotification: notification => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
    };

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }
  },

  removeNotification: id =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  openModal: (type, data) =>
    set(state => ({
      modals: {
        ...state.modals,
        [type]: {
          isOpen: true,
          type,
          data,
        },
      },
    })),

  closeModal: type =>
    set(state => ({
      modals: {
        ...state.modals,
        [type]: {
          isOpen: false,
          type: null,
          data: null,
        },
      },
    })),

  setLoading: (key, loading) =>
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    })),

  setError: (key, error) =>
    set(state => ({
      errors: {
        ...state.errors,
        [key]: error,
      },
    })),

  clearErrors: () => set({ errors: {} }),
}));
