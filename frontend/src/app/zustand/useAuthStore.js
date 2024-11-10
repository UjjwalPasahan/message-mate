"use client"
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      authName: '',
      isAuthenticated: false,
      updateAuthName: (name) => set({ 
        authName: name,
        isAuthenticated: true 
      }),
      logout: () => set({ 
        authName: '', 
        isAuthenticated: false 
      })
    }),
    {
      name: 'auth-storage', // unique name for localStorage
    }
  )
);