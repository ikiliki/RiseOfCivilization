import './Button.styles.css';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`roc-button ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
