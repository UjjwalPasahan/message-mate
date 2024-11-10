"use client";
import React, { useEffect } from 'react';
import { useUsersStore } from '../zustand/usersStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useAuthStore } from '../zustand/useAuthStore';
import axios from 'axios';

export const Users = () => {
  const { users } = useUsersStore();
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { authName } = useAuthStore();
  const { updateChatMsgs } = useChatMsgsStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  };

  const getChat = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8080/msgs',
        {
          params: {
            sender: authName,
            receiver: chatReceiver,
          },
        }
      );

      if (res.data.length !== 0) {
        updateChatMsgs(res.data);
      } else {
        updateChatMsgs([]); // Clear chat messages if none exist
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching messages...');
    if (chatReceiver) {
      getChat();
    }
  }, [chatReceiver]); // Dependency on chatReceiver ensures fetch on receiver change

  return (
    <div className="p-4">
      {users.map((user, index) => (
        <div
          key={index}
          onClick={() => setChatReceiver(user)}
          className={`cursor-pointer rounded-xl m-3 p-5 text-white ${
            chatReceiver === user.username ? 'bg-blue-600' : 'bg-blue-400'
          }`}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};
