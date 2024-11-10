import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatMsgsStore = create(
  persist(
    (set) => ({
      chatMsgs: [],
      updateChatMsgs: (chatMsgs) => set({ chatMsgs }),
    }),
    {
      name: 'chat-messages-storage', // unique name for localStorage key
    }
  )
);