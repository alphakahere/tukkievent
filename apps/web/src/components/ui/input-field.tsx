import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";

export interface FieldProps extends React.ComponentProps<"input"> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ className, label, id, error, required, helperText, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <Label htmlFor={id} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          className={cn(
            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
          {...props}
        />
        {helperText && !error && (
          <small id={`${id}-description`} className="text-xs text-gray-500 -mt-1 block">
            {helperText}
          </small>
        )}
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        
      </div>
    );
  }
);

InputField.displayName = "InputField";

export { InputField };
