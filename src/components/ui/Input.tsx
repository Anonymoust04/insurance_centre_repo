import type { ReactNode, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
}

export function Input({ label, error, className, id, endAdornment, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-lg font-bold text-card-outline"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn(
            'w-full px-4 py-3 border-sketch-sm',
            'bg-white text-card-text font-sans',
            'placeholder:text-slate-400 text-lg',
            'focus:outline-none focus:ring-4 focus:ring-pastel-lavender/50',
            'transition-all duration-200',
            endAdornment ? 'pr-12' : undefined,
            error && 'border-red-400 focus:ring-red-500',
            className,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-0.5 font-bold font-handwriting">{error}</p>}
    </div>
  );
}
