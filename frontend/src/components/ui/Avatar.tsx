import React from 'react';

interface AvatarProps {
  name?: string;
  email?: string;
  src?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({
  name = '',
  email = '',
  src,
  alt = name || email,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
    xl: 'h-12 w-12 text-lg',
  };

  const getInitials = (name: string, email: string): string => {
    if (name) {
      return name
        .split(' ')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(part => part[0].toUpperCase())
        .slice(0, 2)
        .join('');
    }
    return email ? email[0].toUpperCase() : '?';
  };

  const initials = getInitials(name, email);
  const bgColor = name ? 'bg-blue-500' : 'bg-gray-500';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', bgColor, 'text-white', 'rounded-full', sizeClasses[size]);
          e.currentTarget.parentElement?.classList.remove('hidden');
        }}
      />
    );
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${bgColor} 
      text-white 
      rounded-full 
      flex 
      items-center 
      justify-center 
      font-medium 
      ${className}
    `}>
      {initials}
    </div>
  );
};

export default Avatar;
