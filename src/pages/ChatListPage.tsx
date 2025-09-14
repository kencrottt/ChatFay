
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getChatPreviews } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';
import type { ChatPreview } from '../types';
import Layout from '../components/Layout';
import { PageSpinner } from '../components/Spinner';
import Avatar from '../components/Avatar';

const ChatListItem: React.FC<{ chat: ChatPreview }> = ({ chat }) => {
    const truncate = (text: string, length: number) => {
        return text.length > length ? `${text.substring(0, length)}...` : text;
    }

    const time = new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Link to={`/chat/${chat.contact.userId}`}>
            <motion.div
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
            >
                <div className="mr-4 flex-shrink-0">
                    <Avatar 
                        displayName={chat.contact.displayName} 
                        avatarUrl={chat.contact.avatarUrl}
                        size="md"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-textPrimary">{chat.contact.displayName}</p>
                        <p className="text-xs text-textSecondary">{time}</p>
                    </div>
                    <p className="text-sm text-textSecondary">{truncate(chat.lastMessage.text, 30)}</p>
                </div>
            </motion.div>
        </Link>
    );
};

const ChatListPage: React.FC = () => {
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchChats = async () => {
            if (user?.userId) {
                try {
                    const chatPreviews = await getChatPreviews(user.userId);
                    setChats(chatPreviews);
                } catch (error) {
                    console.error("Failed to fetch chats:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (isLoading) {
        return (
            <Layout title="Chats">
                <PageSpinner />
            </Layout>
        );
    }
    
    return (
        <Layout title="Chats">
            {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <p className="text-lg">No conversations yet.</p>
                    <p>Click on "Add Contact" to start chatting.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {chats.map((chat, index) => (
                       <motion.div key={chat.contact.userId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                           <ChatListItem chat={chat} />
                       </motion.div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default ChatListPage;