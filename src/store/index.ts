import { create } from 'zustand';
import { User } from '@/src/types';

interface AppState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isTestDriveOpen: boolean;
  setTestDriveOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  isTestDriveOpen: false,
  setTestDriveOpen: (isTestDriveOpen) => set({ isTestDriveOpen }),
}));
