'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DashFileUpload({
  label,
  helperText = 'PNG, JPG, WebP up to 10MB. Automatically optimized.',
  currentUrl,
  onFileSelect,
  onChange,
  onRemove,
  onClear,
  aspect = 'square', // 'square' | 'banner' | 'video'
  required = false,
  error,
  className = '',
}) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!fileName) {
      setPreview(currentUrl || null);
    }
  }, [currentUrl, fileName]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    const selectCb = onFileSelect || onChange;
    if (selectCb) {
      selectCb(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    const removeCb = onRemove || onClear;
    if (removeCb) {
      removeCb();
    }
  };

  const aspectStyles = {
    square: 'h-36 w-36',
    banner: 'h-36 w-full',
    video: 'h-44 w-full',
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#343C6A] tracking-wide">
          {label} {required && <span className="text-[#B88E2F]">*</span>}
        </label>
      )}

      {preview ? (
        <div className="relative group bg-[#F5F7FA] rounded-2xl p-2 border border-[#E6EFF5] flex flex-col items-center">
          <div
            className={`relative overflow-hidden rounded-xl bg-white shadow-xs ${
              aspectStyles[aspect] || 'h-36 w-full'
            }`}
          >
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-xs font-semibold text-[#343C6A] transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="w-full pt-2 px-1 flex items-center justify-between text-xs text-[#718EBF]">
            <span className="truncate max-w-[200px] font-mono text-[11px]">
              {fileName || 'Existing file'}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-rose-500 hover:text-rose-700 font-medium text-[11px] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#B88E2F] bg-[#FAF3EA]/70 scale-[1.01]'
              : 'border-[#DFEAF2] hover:border-[#B88E2F] bg-[#F5F7FA] hover:bg-[#FAF3EA]/40'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B88E2F] shadow-xs mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#343C6A]">
            Click to upload or drag & drop
          </span>
          <span className="text-[11px] text-[#718EBF] mt-0.5 text-center">{helperText}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{typeof error === 'string' ? error : error.message}</span>
        </div>
      )}
    </div>
  );
}
