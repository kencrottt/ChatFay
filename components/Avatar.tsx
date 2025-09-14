
import React from 'react';

interface AvatarProps {
  displayName: string;
  avatarUrl: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-24 h-24 text-4xl',
};

const Avatar: React.FC<AvatarProps> = ({ displayName, avatarUrl, size = 'md' }) => {
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  if (avatarUrl) {
    return <img src={avatarUrl} alt={displayName} className={`${sizeClasses[size]} rounded-full object-cover bg-gray-200`} />;
  }

  return (
    <div className={`${sizeClasses[size]} bg-secondary rounded-full flex items-center justify-center text-white font-bold`}>
      {initial}
    </div>
  );
};

export default Avatar;
