"use client";
import React, { forwardRef, useId, useMemo, useState } from "react";
import { TextFieldProps } from "./TextField.types";
import { cn } from "@/utils";

export const TextField = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	TextFieldProps
>(
	(
		{
			value,
			defaultValue,
			onChange,
			onBlur,
			onFocus,
			placeholder,
			label,
			helperText,
			error = false,
			disabled = false,
			required = false,
			multiline = false,
			rows,
			type = "text",
			name,
			id,
			fullWidth = false,
			size = "medium",
			variant = "outlined",
			InputProps,
			className,
			...rest
		},
		ref
	) => {
		const InputComponent =
			InputProps?.inputComponent ?? (multiline ? "textarea" : "input");
		const reactId = useId();
		const inputId = id ?? `textfield-${reactId}`;
		const isControlled = value !== undefined;
		const [focused, setFocused] = useState(false);

		const handleChange: React.ChangeEventHandler<
			HTMLInputElement | HTMLTextAreaElement
		> = (event) => {
			onChange?.(event);
		};

		const handleFocus: React.FocusEventHandler<
			HTMLInputElement | HTMLTextAreaElement
		> = (event) => {
			setFocused(true);
			onFocus?.(event);
		};

		const handleBlur: React.FocusEventHandler<
			HTMLInputElement | HTMLTextAreaElement
		> = (event) => {
			setFocused(false);
			onBlur?.(event);
		};

		const sizeClasses = useMemo(() => {
			if (size === "small") {
				return {
					container: `${multiline ? "min-h-10" : "h-[45px]"} text-sm`,
					labelRest: "text-base mb-1",
					padding: "py-2.5 px-[14px]",
					gap: "gap-1.5",
				};
			}
			return {
				container: `${multiline ? "min-h-10" : "h-[45px]"} text-sm`,
				labelRest: "text-base mb-1",
				padding: "py-2.5 px-[14px]",
				gap: "gap-1.5",
			};
		}, [size]);

		const baseLabelColor = disabled ? "text-gray-400" : "text-gray-900";

		const fieldBackground = variant === "filled" ? "bg-gray-50" : "bg-white";
		const helperColor = error ? "text-error-500" : "text-gray-500";
		const withStartAdornment = Boolean(InputProps?.startAdornment);
		const withEndAdornment = Boolean(InputProps?.endAdornment);
		const placeholderText = placeholder;
		const inputValueProps = isControlled ? { value } : { defaultValue };

		const outlinedBorder = cn(
			"border transition-colors duration-200 rounded-lg",
			disabled
				? "border-gray-200"
				: error
					? "!border-error-500"
					: "border-gray-300",
			!disabled && !error && "group-hover:border-gray-400",
			focused && !error && "border-primary-500",
			focused && error && "!border-gray-500"
		);

		const filledBorder = cn(
			"border-b transition-colors duration-200",
			disabled
				? "border-gray-200"
				: error
					? "!border-b-error-500"
					: "border-gray-300",
			!disabled && !error && "group-hover:border-gray-400",
			focused && !error && "border-primary-500 border-b-2",
			focused && error && "!border-b-error-500 border-b-2"
		);

		const rootClasses = cn(
			"flex flex-col",
			fullWidth ? "w-full" : "w-auto",
			className
		);
		const containerClasses = cn(
			"relative w-full group",
			multiline ? "items-start" : "items-center",
			"flex",
			sizeClasses.container,
			sizeClasses.padding,
			sizeClasses.gap,
			fieldBackground,
			disabled && "bg-gray-100",
			variant === "outlined" && outlinedBorder
		);

		const inputClasses = cn(
			"peer w-full bg-transparent outline-none text-gray-900 text-base",
			disabled && "!text-[#00000061] cursor-not-allowed",
			type === "search" && "appearance-none",
			withStartAdornment && "pl-0",
			withEndAdornment && "pr-0",
			multiline && "min-h-[96px] resize-none",
			InputProps?.className
		);

		return (
			<div className={rootClasses}>
				{label && (
					<label
						htmlFor={inputId}
						className={cn(
							"mb-1 font-medium",
							sizeClasses.labelRest,
							baseLabelColor,
							disabled && "cursor-not-allowed"
						)}
					>
						{label}
						{required && (
							<span className="text-error-500 font-bold ps-1">*</span>
						)}
					</label>
				)}
				<div className={`${containerClasses} input-container`}>
					{InputProps?.startAdornment && (
						<span className="flex items-center text-gray-500">
							{InputProps.startAdornment}
						</span>
					)}
					<InputComponent
						ref={ref as React.Ref<HTMLElement>}
						id={inputId}
						name={name}
						type={multiline ? undefined : type}
						rows={multiline ? rows : undefined}
						placeholder={placeholderText}
						disabled={disabled}
						required={required}
						aria-invalid={error || undefined}
						aria-required={required || undefined}
						className={inputClasses}
						onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						{...inputValueProps}
						{...rest}
					/>
					{InputProps?.endAdornment && (
						<span className="flex items-center text-gray-500">
							{InputProps.endAdornment}
						</span>
					)}
					{variant !== "outlined" && (
						<div
							aria-hidden
							className={cn("absolute inset-x-0 bottom-0", filledBorder)}
						/>
					)}
				</div>
				{helperText && (
					<p className={cn("mt-1 text-sm", helperColor)}>{helperText}</p>
				)}
			</div>
		);
	}
);

TextField.displayName = "TextField";

