
import React from 'react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  text: string;
  isSent: boolean;
  timestamp: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isSent, timestamp }) => {
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const bubbleClasses = isSent
    ? 'bg-primary text-white self-end'
    : 'bg-gray-200 text-textPrimary self-start';
  
  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      {...animationProps}
      className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm flex flex-col text-gray-700 ${bubbleClasses}`}
    >
      <p className="text-sm break-words text-gray-700">{text}</p>
      <span className={`text-xs mt-1 self-end  ${isSent ? 'text-gray-700' : 'text-gray-700'}`}>
        {time}
      </span>
    </motion.div>
  );
};

export default MessageBubble;