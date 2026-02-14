import * as React from "react";

/* ============================= */
/* Change Reason */
/* ============================= */

export type AutocompleteChangeReason =
	| "selectOption"
	| "removeOption"
	| "clear"
	| "blur";

/* ============================= */
/* Render Option State */
/* ============================= */

export interface AutocompleteRenderOptionState {
	selected: boolean;
	index: number;
}

/* ============================= */
/* Render Input Params */
/* ============================= */

export interface RenderInputParams {
	ref: React.Ref<HTMLInputElement>;

	value: string;
	placeholder?: string;
	disabled?: boolean;

	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onFocus: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;

	role: string;
	"aria-autocomplete": "list";
	"aria-controls"?: string;
	"aria-expanded": boolean;
	"aria-activedescendant"?: string;
	autoComplete?: string;

	InputProps: {
		startAdornment?: React.ReactNode;
		endAdornment?: React.ReactNode;
		className?: string;
	};
}

/* ============================= */
/* Base Props */
/* ============================= */

export interface BaseAutocompleteProps<T> {
	options: T[];
	getOptionLabel: (option: T) => string;

	isOptionEqualToValue?: (option: T, value: T) => boolean;

	renderInput: (params: RenderInputParams) => React.ReactNode;

	renderOption?: (
		props: React.HTMLAttributes<HTMLLIElement>,
		option: T,
		state: AutocompleteRenderOptionState
	) => React.ReactNode;

	loading?: boolean;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	/** Text to show when there are no options and not loading */
	emptyText?: string;
}

/* ============================= */
/* Input Native Props (Safe) */
/* ============================= */

type NativeInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "value" | "defaultValue"
>;

/* ============================= */
/* Single Mode */
/* ============================= */

export interface SingleAutocompleteProps<T>
	extends BaseAutocompleteProps<T>, NativeInputProps {
	multiple?: false;

	value?: T | null;
	defaultValue?: T | null;
	disableCloseOnSelect?: boolean;
	onChange?: (
		event: React.SyntheticEvent,
		value: T | null,
		reason: AutocompleteChangeReason
	) => void;
}

/* ============================= */
/* Multiple Mode */
/* ============================= */

export interface MultipleAutocompleteProps<T>
	extends BaseAutocompleteProps<T>, NativeInputProps {
	multiple: true;

	value?: T[];
	defaultValue?: T[];
	disableCloseOnSelect?: boolean;

	onChange?: (
		event: React.SyntheticEvent,
		value: T[],
		reason: AutocompleteChangeReason
	) => void;
}

/* ============================= */
/* Final Discriminated Union */
/* ============================= */

export type AutocompleteProps<T> =
	| SingleAutocompleteProps<T>
	| MultipleAutocompleteProps<T>;
