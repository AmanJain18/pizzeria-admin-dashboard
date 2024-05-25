import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IUser } from './types';

interface IAuthState {
    user: IUser | null;
    setUser: (user: IUser) => void;
    logoutUser: () => void;
}

export const useAuthStore = create<IAuthState>()(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({ user }, false, 'setUser'),
        logoutUser: () => set({ user: null }, false, 'setUser'),
    })),
);
