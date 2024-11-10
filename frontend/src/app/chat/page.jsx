'use client'
import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { useAuthStore } from '../zustand/useAuthStore';
import { useUsersStore } from '../zustand/usersStore'
import { Users } from '../_components/Users';
import axios from 'axios';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import { useRouter } from 'next/navigation';

const Chat = () => {
  const [msg, setMsg] = useState('');
  const [socket, setSocket] = useState(null);
  
  // Get values and update functions from stores
  const { authName } = useAuthStore();
  const { updateUsers } = useUsersStore();
  const chatReceiver = useChatReceiverStore((state) => state.chatReceiver);
  const { chatMsgs, updateChatMsgs } = useChatMsgsStore();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter()

const handleLogout = async () => {
  try {
    logout();
    router.replace('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  const getUserData = async () => {
    const res = await axios.get('http://localhost:5000/users', {
      withCredentials: true
    });
    console.log(res.data);
    updateUsers(res.data.msg);
  };

  useEffect(() => {
    const newSocket = io('http://localhost:8080', {
      query: {
        username: authName,
      }
    });
    setSocket(newSocket);

    // Use the store's getState to always get fresh state
    newSocket.on('chat msg', msg => {
      console.log('Received msg on client:', msg.text);
      const currentMsgs = useChatMsgsStore.getState().chatMsgs;
      updateChatMsgs([...currentMsgs, msg]);
    });

    getUserData();

    return () => newSocket.close();
  }, []); // Remove chatMsgs from dependency array

  const sendMsg = (e) => {
    e.preventDefault();

    const msgToBeSent = {
      text: msg,
      sender: authName,
      receiver: chatReceiver
    };

    if (socket) {
      socket.emit('chat msg', msgToBeSent);
      // Use the store's getState to ensure we have the latest messages
      const currentMsgs = useChatMsgsStore.getState().chatMsgs;
      updateChatMsgs([...currentMsgs, msgToBeSent]);
      setMsg('');
    }
  };

  // Scroll to bottom effect for messages
  useEffect(() => {
    const container = document.querySelector('.msgs-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMsgs]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className= "flex justify-around bg-blue-600 text-white p-4 text-center text-lg font-semibold">
        {authName} Chatting with {chatReceiver}
        <button onClick={handleLogout}>logout</button>
      </header>

      {/* Main Chat Layout */}
      <div className="flex flex-1">
        {/* Sidebar - Users List */}
        <aside className="w-1/4 bg-white shadow-lg p-4">
          <h2 className="text-lg font-bold mb-4">Users</h2>
          <Users />
        </aside>

        {/* Chat Messages Area */}
        <main className="flex-1 flex flex-col bg-gray-50 p-5">
          {/* Chat Messages Container */}
          <div className="msgs-container flex-1 overflow-y-scroll mb-4">
            {chatMsgs?.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-1 ${msg.sender === authName ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-2xl shadow-md ${
                    msg.sender === authName ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center">
            <form onSubmit={sendMsg} className="w-full flex space-x-3">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your message..."
                required
                className="flex-1 block p-4 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;