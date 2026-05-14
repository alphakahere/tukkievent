"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface FormSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface FormSelectProps {
	id: string;
	label: string;
	value: string;
	onValueChange: (value: string) => void;
	options: FormSelectOption[];
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	error?: string;
	helperText?: string;
	containerClassName?: string;
	triggerClassName?: string;
	labelClassName?: string;
}

export function FormSelect({
	id,
	label,
	value,
	onValueChange,
	options,
	placeholder,
	required,
	disabled,
	error,
	helperText,
	containerClassName,
	triggerClassName,
	labelClassName,
}: FormSelectProps) {
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
			<Select value={value} onValueChange={onValueChange} disabled={disabled}>
				<SelectTrigger
					id={id}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy}
					className={cn(
						error &&
							"border-red-500 focus:ring-red-500/30 focus:border-red-500",
						triggerClassName,
					)}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((opt) => (
						<SelectItem
							key={opt.value}
							value={opt.value}
							disabled={opt.disabled}
						>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
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
}
