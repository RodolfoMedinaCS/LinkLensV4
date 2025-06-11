import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  size?: 'sm' | 'md';
}

export default function Tag({ 
  children, 
  variant = 'default', 
  size = 'sm' 
}: TagProps) {
  const baseClasses = 'inline-flex items-center font-mono font-medium border';
  
  const variantClasses = {
    default: 'bg-card text-secondary border-border',
    accent: 'bg-accent/10 text-accent border-accent/20'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}