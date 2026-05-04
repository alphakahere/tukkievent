"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";

export interface PasswordFieldProps extends Omit<React.ComponentProps<"input">, "type"> {
  label: string;
  id: string;
  error?: string;
  hint?: React.ReactNode;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, id, error, hint, className, required, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
            {label}
          </Label>
          {hint}
        </div>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn(
              "pr-11",
              error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";
