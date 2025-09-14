
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(email, password);
      navigate('/set-userid');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full p-8 bg-surface"
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Create Account</h1>
        <p className="text-textSecondary mb-8">Join Gemini Chat to connect with friends.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email" //Component identity
            label="Email"
            type="email"
            value={email} //data inside
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button type="submit" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className="mt-8 text-sm text-textSecondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-secondary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;