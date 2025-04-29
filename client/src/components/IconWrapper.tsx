import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

export default IconWrapper; 