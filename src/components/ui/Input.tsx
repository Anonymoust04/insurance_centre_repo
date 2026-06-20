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
        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700',
            'bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
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
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
