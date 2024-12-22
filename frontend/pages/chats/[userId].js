import { useState, useEffect, useCallback} from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newChatName, setNewChatName] = useState('');
  const [newChatMembers, setNewChatMembers] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const {userId}=router.query;

  // Fetch all chats for the user
  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/chats/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
      }
    };

    fetchChats();

  }, [userId, selectedChat]);

  // Fetch messages for the selected chat
  const fetchMessages = useCallback(async (chat) =>  {
    const data = chat.messages;
    setMessages(data);
  }, []);

  // creating a new chat
  const handleCreateChat = async () => {
    if(!newChatName)
      return
    
    let chatMembers = newChatMembers.split(',').map((id) => id.trim());

    const num_of_participants = chatMembers.length;

    var isGroupChat=false;
    if(num_of_participants>1)
      isGroupChat = true;

    const newChat = {
      creator: userId,
      chatName: newChatName,
      participants: chatMembers,
      isGroupChat,
    };

    try {
      const response = await fetch(`http://localhost:3001/chats/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChat),
      });

      if (response.ok) {
        const createdChat = await response.json();
        setChats((prevChats) => [...prevChats, createdChat]);
        setNewChatName('');
        setNewChatMembers('');
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  // handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      chatId: selectedChat._id,
      senderId: userId,
      message: newMessage,
      timestamp: new Date(),
    };

    try {
      const response = await fetch(`http://localhost:3001/chats/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {

        const updated_chat = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setSelectedChat(updated_chat);
        fetchMessages(updated_chat);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }

  };
  useEffect(() => {
    // Real-time message updates via socket.io
  socket.on('message', (message) => {
    if (message.chatId === selectedChat._id) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  });

  return () => {
    socket.off('message');
  };
}, [selectedChat]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Chats</h1>

      {/* Create Chat */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Chat</h2>
        <input
          type="text"
          placeholder="Other memeber or Chat Name"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Add Members (comma-separated IDs)"
          value={newChatMembers}
          onChange={(e) => setNewChatMembers(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleCreateChat}
          className="bg-black text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Chats</h2>
        {chats.length > 0 ? (
          <ul>
            {chats.map((chat) => (
              <li
                key={chat._id}
                className="mb-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedChat(chat);
                  fetchMessages(chat);
                }}
              >
                {chat.chatName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No chats available.</p>
        )}
      </div>

      {/* Selected Chat Messages */}
      {selectedChat && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Chat: {selectedChat.chatName}
          </h2>
          <div className="mb-6 max-h-80 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message._id} className="mb-4">
                  <p className="text-gray-800">{message.message}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(message.timestamp).toLocaleString()} -{' '}
                    {message.senderId === userId ? 'You' : message.senderName}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No messages yet.</p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg"
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
