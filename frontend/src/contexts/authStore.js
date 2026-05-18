import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    setUser: (user) => set({ user }),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        }
        else {
            localStorage.removeItem('token');
        }
        set({ token, isAuthenticated: !!token });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
