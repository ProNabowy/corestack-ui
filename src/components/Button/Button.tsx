import * as React from 'react';
import { ButtonProps } from './Button.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...rest }, ref) => {
    const base = 'cs-btn';
    const cls = [base, `cs-btn--${variant}`, `cs-btn--${size}`, className].filter(Boolean).join(' ');
    return (
      <button ref={ref} className={cls} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
