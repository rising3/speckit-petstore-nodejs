'use client';
import React from 'react';
import { Button as DaisyButton } from 'react-daisyui';

type DaisyProps = React.ComponentProps<typeof DaisyButton>;

type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';

export type ButtonProps = Omit<DaisyProps, 'className'> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: Size;
    uiVariant?: Variant;
    className?: string;
  };

const sizeClass: Record<Size, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  link: 'btn-link',
};

export default function Button({ size = 'md', uiVariant, className = '', ...rest }: ButtonProps) {
  const classes =
    `${sizeClass[size]} ${uiVariant ? variantClass[uiVariant] : ''} ${className}`.trim();
  return <DaisyButton className={classes || undefined} {...(rest as DaisyProps)} />;
}
