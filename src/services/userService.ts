
import type { User, Contact } from '../types';
import { getUsers, saveUsers, getAllContacts, saveAllContacts } from './db';

export const updateProfile = async (internalId: string, updates: { displayName?: string; avatarUrl?: string | null }): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === internalId);

            if (userIndex === -1) {
                return reject(new Error('User not found.'));
            }

            const userToUpdate = users[userIndex];
            const oldUserId = userToUpdate.userId;
            
            // Apply updates
            if(updates.displayName) userToUpdate.displayName = updates.displayName;
            if(updates.avatarUrl !== undefined) userToUpdate.avatarUrl = updates.avatarUrl;

            users[userIndex] = userToUpdate;
            saveUsers(users);

            // Now, update this user's details in other users' contact lists
            if (oldUserId) {
                const allContacts = getAllContacts();
                Object.keys(allContacts).forEach(userId => {
                    const contactList = allContacts[userId];
                    const contactIndex = contactList.findIndex(c => c.userId === oldUserId);
                    if (contactIndex !== -1) {
                        allContacts[userId][contactIndex].displayName = userToUpdate.displayName;
                        allContacts[userId][contactIndex].avatarUrl = userToUpdate.avatarUrl;
                    }
                });
                saveAllContacts(allContacts);
            }

            resolve(userToUpdate);
        }, 500);
    });
};

export const setUserId = async (internalId: string, newUserId: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const normalized = newUserId.trim().toLowerCase();
            const userExists = users.some(u => (u.userId || '').toLowerCase() === normalized);
            if (userExists) {
                return reject(new Error('This User ID is already taken.'));
            }

            const userIndex = users.findIndex(u => u.id === internalId);
            if (userIndex === -1) {
                return reject(new Error('User not found.'));
            }

            users[userIndex].userId = normalized;
            saveUsers(users);
            resolve(users[userIndex]);
        }, 500);
    });
};

export const findUserByUserId = async (userId: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const normalized = userId.trim().toLowerCase();
            const user = users.find(u => (u.userId || '').toLowerCase() === normalized);
            if (user) {
                resolve(user);
            } else {
                reject(new Error(`User with ID '${userId}' not found.`));
            }
        }, 300);
    });
};

export const addContact = async (currentUserId: string, contactUserId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const currentUser = users.find(u => u.userId === currentUserId);
            const contactUser = users.find(u => u.userId === contactUserId);

            if (!currentUser || !contactUser || !currentUser.userId || !contactUser.userId) {
                return reject(new Error("One or both users not found."));
            }

            const allContacts = getAllContacts();

            // Add contact for current user
            if (!allContacts[currentUserId]) allContacts[currentUserId] = [];
            if (!allContacts[currentUserId].some(c => c.userId === contactUserId)) {
                allContacts[currentUserId].push({ 
                    userId: contactUser.userId, 
                    displayName: contactUser.displayName, 
                    avatarUrl: contactUser.avatarUrl 
                });
            }

            // Add current user as contact for the other user (reciprocal)
            if (!allContacts[contactUserId]) allContacts[contactUserId] = [];
            if (!allContacts[contactUserId].some(c => c.userId === currentUserId)) {
                allContacts[contactUserId].push({ 
                    userId: currentUser.userId,
                    displayName: currentUser.displayName,
                    avatarUrl: currentUser.avatarUrl
                });
            }

            saveAllContacts(allContacts);
            resolve();
        }, 300);
    });
};

export const getContacts = async (userId: string): Promise<Contact[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allContacts = getAllContacts();
            resolve(allContacts[userId] || []);
        }, 200);
    });
};