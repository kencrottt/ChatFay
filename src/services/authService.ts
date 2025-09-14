
import type { User } from '../types';
import { getUsers, saveUsers } from './db';

// This is a mock service. In a real app, this would make API calls.
// It also doesn't handle password hashing for security, which is critical.

export const register = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        return reject(new Error('User with this email already exists.'));
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`, // Simple unique ID
        email,
        userId: null,
        displayName: email.split('@')[0],
        avatarUrl: null,
      };
      
      // We are not storing the password here for mock purposes.
      // A real DB would store a hashed password.
      users.push(newUser);
      saveUsers(users);
      resolve(newUser);
    }, 500);
  });
};

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      // NOTE: We don't have passwords stored, so this is a simplified check.
      // A real backend would verify the hashed password.
      const user = users.find(u => u.email === email);
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 500);
  });
};