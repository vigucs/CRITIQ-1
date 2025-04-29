import React from 'react';
import { IconBaseProps } from 'react-icons';
import { IconType as ReactIconType } from 'react-icons';

interface IconProps extends Omit<IconBaseProps, 'size'> {
  icon: ReactIconType;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 24, className = '', ...props }) => {
  return <IconComponent size={size} className={className} {...props} />;
};

export default Icon; 