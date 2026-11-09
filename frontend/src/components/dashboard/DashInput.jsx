'use client';

import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const DashInput = forwardRef(function DashInput(
  {
    label,
    error,
    icon: Icon,
    className = '',
    wrapperClassName = '',
    required = false,
    helperText,
    id,
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#343C6A] tracking-wide"
        >
          {label} {required && <span className="text-[#B88E2F]">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#718EBF]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`w-full h-11 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl sm:rounded-[14px] border-0 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${error ? 'ring-2 ring-rose-500/50 bg-rose-50/20' : ''} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{typeof error === 'string' ? error : error.message}</span>
        </div>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-[#718EBF] mt-1">{helperText}</p>
      )}
    </div>
  );
});

export default DashInput;
