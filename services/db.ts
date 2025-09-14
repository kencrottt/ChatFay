
// --- MOCK DATABASE using localStorage ---
// In a real-world application, this file would not exist.
// Instead, you would have a backend server (e.g., Node.js/Express)
// that connects to a real MySQL database. The services would make
// HTTP requests (e.g., using fetch or axios) to that server.

import type { User, Message, Contact } from '../types';

const DB = {
  users: 'chat_db_users',
  messages: 'chat_db_messages',
  contacts: 'chat_db_contacts', // Stored as { [userId]: Contact[] }
};

// Initialize DB if it doesn't exist
const initializeDB = () => {
  if (!localStorage.getItem(DB.users)) {
    localStorage.setItem(DB.users, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB.messages)) {
    localStorage.setItem(DB.messages, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB.contacts)) {
    localStorage.setItem(DB.contacts, JSON.stringify({}));
  }
};

initializeDB();

// --- User Management ---
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(DB.users) || '[]');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(DB.users, JSON.stringify(users));
};

// --- Message Management ---
export const getMessagesFromDB = (): Message[] => {
  return JSON.parse(localStorage.getItem(DB.messages) || '[]');
};

export const saveMessages = (messages: Message[]) => {
  localStorage.setItem(DB.messages, JSON.stringify(messages));
};

// --- Contact Management ---
export const getAllContacts = (): { [userId: string]: Contact[] } => {
    return JSON.parse(localStorage.getItem(DB.contacts) || '{}');
};

export const saveAllContacts = (contacts: { [userId: string]: Contact[] }) => {
    localStorage.setItem(DB.contacts, JSON.stringify(contacts));
};
