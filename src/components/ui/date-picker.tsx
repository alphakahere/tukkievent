"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
	id: string;
	label: string;
	/** ISO date string in `YYYY-MM-DD` format (empty when unset). */
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	disabledDates?: (date: Date) => boolean;
	error?: string;
	helperText?: string;
	containerClassName?: string;
	labelClassName?: string;
	align?: "start" | "center" | "end";
}

export function DatePicker({
	id,
	label,
	value,
	onChange,
	placeholder = "Choisir une date",
	required,
	disabled,
	disabledDates,
	error,
	helperText,
	containerClassName,
	labelClassName,
	align = "start",
}: DatePickerProps) {
	const selected = value ? new Date(`${value}T00:00:00`) : undefined;
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
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id={id}
						type="button"
						variant="outline"
						disabled={disabled}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedBy}
						className={cn(
							"w-full justify-start h-12 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm font-normal text-gray-900 hover:bg-gray-100 hover:text-gray-900",
							!value && "text-gray-400",
							error && "border-red-500",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
						{selected
							? format(selected, "dd MMMM yyyy", { locale: fr })
							: placeholder}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align={align}>
					<Calendar
						mode="single"
						locale={fr}
						selected={selected}
						onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
						disabled={disabledDates}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
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
