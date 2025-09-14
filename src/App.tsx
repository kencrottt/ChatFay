
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetUserIdPage from './pages/SetUserIdPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import AddContactPage from './pages/AddContactPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/Spinner';

// A wrapper for routes that require authentication.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but hasn't set their userId, redirect them.
  if (!user.userId) {
     return <Navigate to="/set-userid" replace />;
  }

  return <>{children}</>;
};

// A wrapper for the set-userid page
const SetUserIdRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.userId) return <Navigate to="/chats" replace />;
    return <>{children}</>;
};


const App: React.FC = () => {
    const location = useLocation();

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-200 font-sans">
            <div className="w-full h-full sm:w-[400px] sm:h-[800px] bg-background shadow-2xl sm:rounded-3xl overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        
                        <Route path="/set-userid" element={
                            <SetUserIdRoute>
                                <SetUserIdPage />
                            </SetUserIdRoute>
                        }/>

                        <Route path="/chats" element={
                            <ProtectedRoute>
                                <ChatListPage />
                            </ProtectedRoute>
                        }/>
                        <Route path="/chat/:contactId" element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }/>
                        <Route path="/add-contact" element={
                            <ProtectedRoute>
                                <AddContactPage />
                            </ProtectedRoute>
                        }/>
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }/>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default App;