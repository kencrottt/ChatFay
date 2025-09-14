import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import Spinner from './Spinner';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, isLoading = false, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-800',
    secondary: 'bg-gray-200 text-textPrimary hover:bg-gray-300',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`text-gray-700 w-full flex items-center justify-center py-3 px-4 font-bold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </motion.button>
  );
};

export default Button;