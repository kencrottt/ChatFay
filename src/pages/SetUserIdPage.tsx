
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';
import { setUserId as setUserIdService } from '../services/userService';

const SetUserIdPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Not authenticated.");
      return;
    }
    if (userId.length < 3) {
        setError("User ID must be at least 3 characters long.");
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const updatedUser = await setUserIdService(user.id, userId);
      setUser(updatedUser); // Update user in context
      navigate('/chats');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.9 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col items-center justify-center h-full p-8 bg-surface"
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Choose Your User ID</h1>
        <p className="text-textSecondary mb-8">This will be your unique username. Others can find you with this ID.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="userId"
            label="User ID"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value.toLowerCase())}
            required
            placeholder="e.g., john_doe"
            error={error}
          />
          
          <Button type="submit" isLoading={isLoading}>
            Save and Continue
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default SetUserIdPage;