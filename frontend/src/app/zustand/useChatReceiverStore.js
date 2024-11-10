import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatReceiverStore = create(
  persist(
    (set) => ({
      chatReceiver: '',
      updateChatReceiver: (chatReceiver) => set({ chatReceiver }),
    }),
    {
      name: 'chat-receiver-storage', // unique name for localStorage key
    }
  )
);