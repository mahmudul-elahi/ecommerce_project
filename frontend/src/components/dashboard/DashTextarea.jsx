'use client';

import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const DashTextarea = forwardRef(function DashTextarea(
  {
    label,
    error,
    className = '',
    wrapperClassName = '',
    required = false,
    helperText,
    id,
    rows = 3,
    ...props
  },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-[#343C6A] tracking-wide"
        >
          {label} {required && <span className="text-[#B88E2F]">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full p-4 text-sm bg-[#F5F7FA] text-[#343C6A] placeholder-[#8BA3CB] rounded-xl sm:rounded-[14px] border-0 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#B88E2F]/30 resize-none ${
          error ? 'ring-2 ring-rose-500/50 bg-rose-50/20' : ''
        } ${className}`}
        {...props}
      />

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

export default DashTextarea;
