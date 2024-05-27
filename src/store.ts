import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IUser } from './types';
import { self } from './http/api';

interface IAuthState {
    user: IUser | null;
    setUser: (user: IUser) => void;
    logoutUser: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<IAuthState>()(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({ user }, false, 'setUser'),
        logoutUser: () => {
            set({ user: null }, false, 'logoutUser');
        },
        fetchUser: async () => {
            try {
                const { data } = await self();
                if (!data) {
                    set({ user: null }, false, 'No user found');
                    return;
                }
                set({ user: data }, false, 'fetchUser');
            } catch (error) {
                set({ user: null }, false, 'error fetching user');
            }
        },
    })),
);
