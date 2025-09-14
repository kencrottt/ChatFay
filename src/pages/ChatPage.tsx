
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage } from '../../services/chatService';
import { findUserByUserId } from '../../services/userService';
import { useAuth } from '../hooks/useAuth';
import type { Message, User } from '../../types';
import Layout from '../components/Layout';
import MessageBubble from '../components/MessageBubble';
import Button  from '../components/Button';

const ChatPage: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contact, setContact] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatData = async () => {
      if (user?.userId && contactId) {
        setIsLoading(true);
        try {
          const [fetchedMessages, fetchedContact] = await Promise.all([
            getMessages(user.userId, contactId),
            findUserByUserId(contactId),
          ]);
          setMessages(fetchedMessages);
          setContact(fetchedContact);
        } catch (error) {
          console.error("Failed to fetch chat data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchChatData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user?.userId || !contactId || isSending) return;

    setIsSending(true);
    const sentMessage = await sendMessage(user.userId, contactId, newMessage);
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
    setIsSending(false);
  };
  



  return (
    <Layout title={contact?.displayName || contactId || 'Chat'} showBackButton showBottomNav={false}>
      <div className="flex flex-col h-full pb-16">
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <MessageBubble
                    key={msg.id}
                    text={msg.text}
                    isSent={msg.senderId === user?.userId}
                    timestamp={msg.timestamp}
                    />
                ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-surface border-t">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={isSending}
            />
            <Button
              type="submit"
              className="p-3 bg-secondary text-white rounded-full"
              disabled={isSending}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;