import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "../types/admin";
import adminApi from "../services/adminApi";

interface AdminStore {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (login: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await adminApi.login({ login, password });

          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          if (response.data) {
            const { token, user } = response.data;
            localStorage.setItem("adminToken", token);

            set({
              user: { ...user, token },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          }

          return false;
        } catch (_error) {
          // eslint-disable-line @typescript-eslint/no-unused-vars
          set({
            error: "Login failed. Please try again.",
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem("adminToken");
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "admin-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
