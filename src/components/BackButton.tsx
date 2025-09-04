import React from 'react';
import Button from './Button';

export interface BackButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Back button component with arrow icon and hover effects
 */
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  children = 'Back to Gallery',
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <Button
      onClick={onClick}
      className={`btn--back ${className}`}
      aria-label={ariaLabel || children?.toString()}
    >
      <span className="btn__icon" aria-hidden="true">←</span>
      {children}
    </Button>
  );
};

export default BackButton;
