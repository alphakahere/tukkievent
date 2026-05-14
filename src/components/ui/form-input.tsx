"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const baseInputClass =
	"w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export interface FormInputProps
	extends Omit<React.ComponentProps<"input">, "id"> {
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	helperText?: string;
	containerClassName?: string;
	labelClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
	(
		{
			id,
			label,
			required,
			error,
			helperText,
			containerClassName,
			labelClassName,
			className,
			...props
		},
		ref,
	) => {
		const describedBy = error
			? `${id}-error`
			: helperText
				? `${id}-help`
				: undefined;
		return (
			<div className={cn("space-y-1.5", containerClassName)}>
				<label
					htmlFor={id}
					className={cn(
						"text-sm font-medium text-gray-700 block",
						labelClassName,
					)}
				>
					{label}
					{required && <span className="text-red-500"> *</span>}
				</label>
				<input
					id={id}
					ref={ref}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					className={cn(
						baseInputClass,
						error &&
							"border-red-500 focus:ring-red-500/30 focus:border-red-500",
						className,
					)}
					{...props}
				/>
				{error ? (
					<p id={`${id}-error`} role="alert" className="text-xs text-red-500">
						{error}
					</p>
				) : helperText ? (
					<p id={`${id}-help`} className="text-xs text-gray-500">
						{helperText}
					</p>
				) : null}
			</div>
		);
	},
);

FormInput.displayName = "FormInput";
