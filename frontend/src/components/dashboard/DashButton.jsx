'use client';

import React from 'react';

export default function DashButton({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  isLoading = false,
  className = '',
  onClick,
  ...props
}) {
  const variantStyles = {
    primary:
      'bg-[#B88E2F] hover:bg-[#967125] text-white shadow-sm shadow-[#B88E2F]/20 active:scale-[0.99]',
    secondary:
      'bg-[#F5F7FA] hover:bg-[#FAF3EA] text-[#343C6A] hover:text-[#B88E2F] active:scale-[0.99]',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 active:scale-[0.99]',
    outline:
      'bg-white hover:bg-[#F5F7FA] text-[#343C6A] border border-[#E6EFF5] hover:border-[#B88E2F]/40 active:scale-[0.99]',
    ghost:
      'text-[#718EBF] hover:text-[#343C6A] hover:bg-[#F5F7FA] active:scale-[0.99]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium',
    md: 'px-5 py-2.5 text-sm rounded-xl sm:rounded-[14px] gap-2 font-semibold',
    lg: 'px-6 py-3 text-base rounded-2xl gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all border-0 outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
