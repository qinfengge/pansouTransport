import React from 'react';
import { IconProps } from '../types';

const Icon: React.FC<IconProps> = ({ name, className = '', size = 24, filled = false }) => {
  return (
    <span 
      className={`material-symbols-outlined ${className} select-none`}
      style={{ 
        fontSize: `${size}px`,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0"
      }}
    >
      {name}
    </span>
  );
};

export default Icon;