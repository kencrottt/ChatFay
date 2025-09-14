import type { Message, ChatPreview } from '../types';
import { getMessagesFromDB, saveMessages } from './db';
import { getContacts } from './userService';

// --- CHAT SERVICE ---
// In a real app, these functions would make API calls to your backend.

export const getMessages = async (userId1: string, userId2: string): Promise<Message[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allMessages = getMessagesFromDB();
            const conversation = allMessages.filter(
                (msg) =>
                    (msg.senderId === userId1 && msg.receiverId === userId2) ||
                    (msg.senderId === userId2 && msg.receiverId === userId1)
            );
            resolve(conversation.sort((a, b) => a.timestamp - b.timestamp));
        }, 400);
    });
};

export const sendMessage = async (senderId: string, receiverId: string, text: string): Promise<Message> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allMessages = getMessagesFromDB();
            const newMessage: Message = {
                id: `msg_${Date.now()}`,
                senderId,
                receiverId,
                text,
                timestamp: Date.now(),
            };
            allMessages.push(newMessage);
            saveMessages(allMessages);
            resolve(newMessage);
        }, 200);
    });
};

export const getChatPreviews = async (currentUserId: string): Promise<ChatPreview[]> => {
    return new Promise(async (resolve) => {
        const contacts = await getContacts(currentUserId);
        const allMessages = getMessagesFromDB();
        
        const previews: ChatPreview[] = contacts.map(contact => {
            const conversationMessages = allMessages.filter(
                msg => (msg.senderId === currentUserId && msg.receiverId === contact.userId) ||
                       (msg.senderId === contact.userId && msg.receiverId === currentUserId)
            ).sort((a, b) => b.timestamp - a.timestamp);

            const lastMessage = conversationMessages[0];

            return {
                contact: contact,
                lastMessage: lastMessage || {
                    id: '', senderId: '', receiverId: '', text: 'No messages yet.', timestamp: 0
                }
            };
        }).filter(p => p.lastMessage.id !== '') // Filter out contacts with no messages
          .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);

        resolve(previews);
    });
};