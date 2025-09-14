
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, PlusCircleIcon, UserIcon, ArrowLeftIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  showBottomNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ title, children, showBackButton = false, showBottomNav = true }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-background"
    >
      <header className="bg-primary text-white shadow-md z-10 p-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <button onClick={handleLogout} className="text-sm font-medium hover:underline">Logout</button>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        {children}
      </main>

      {showBottomNav && (
        <nav className="bg-surface border-t border-gray-200 p-2 flex justify-around sticky bottom-0">
          <NavLink
            to="/chats"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-500 hover:bg-gray-100'
              }`
            }
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Chats</span>
          </NavLink>
           <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-500 hover:bg-gray-100'
              }`
            }
          >
            <UserIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>
          <NavLink
            to="/add-contact"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${
                isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-500 hover:bg-gray-100'
              }`
            }
          >
            <PlusCircleIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Add Contact</span>
          </NavLink>
        </nav>
      )}
    </motion.div>
  );
};

export default Layout;
