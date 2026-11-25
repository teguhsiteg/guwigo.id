"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/utils";

/* ─── Text Input ─── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#64748B] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-normal text-[#0F172A]",
              "placeholder:text-[#94A3B8] shadow-sm",
              "focus:outline-none focus:ring-4 focus:ring-[#2563EB]/15 focus:border-[#2563EB]",
              "transition-all duration-200",
              "disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-[#EF4444] focus:ring-[#EF4444]/15 focus:border-[#EF4444]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ─── Textarea ─── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#64748B] tracking-tight"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-normal text-[#0F172A]",
            "placeholder:text-[#94A3B8] shadow-sm resize-none",
            "focus:outline-none focus:ring-4 focus:ring-[#2563EB]/15 focus:border-[#2563EB]",
            "transition-all duration-200",
            error && "border-[#EF4444] focus:ring-[#EF4444]/15 focus:border-[#EF4444]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/* ─── Select ─── */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#64748B] tracking-tight"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-normal text-[#0F172A]",
            "focus:outline-none focus:ring-4 focus:ring-[#2563EB]/15 focus:border-[#2563EB]",
            "transition-all duration-200 cursor-pointer shadow-sm",
            error && "border-[#EF4444] focus:ring-[#EF4444]/15 focus:border-[#EF4444]",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-[#C94040]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export default Input;
