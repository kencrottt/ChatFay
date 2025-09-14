
export interface User {
  id: string; // Internal unique ID (e.g., from DB)
  email: string;
  userId: string | null; // Public, user-chosen unique ID
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthenticatedUser extends User {
  userId: string; // userId is guaranteed for an authenticated user in the main app
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface ChatPreview {
  contact: {
    userId: string;
    displayName: string;
    avatarUrl: string | null;
  };
  lastMessage: Message;
}

export interface Contact {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}