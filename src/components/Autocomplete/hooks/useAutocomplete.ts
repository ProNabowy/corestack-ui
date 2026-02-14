"use client";

import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	AutocompleteChangeReason,
	AutocompleteProps,
} from "../Autocomplete.types";

export default function useAutocomplete<T>(props: AutocompleteProps<T>) {
	const {
		options,
		value,
		defaultValue,
		onChange,
		getOptionLabel,
		isOptionEqualToValue,
		multiple,
		disabled,
		disableCloseOnSelect,
	} = props;

	const getLabel = useCallback(
		(option: T) => {
			if (getOptionLabel) return getOptionLabel(option);

			return String(option);
		},
		[getOptionLabel]
	);

	const isEqual = useCallback(
		(option: T, v: T) =>
			isOptionEqualToValue
				? isOptionEqualToValue(option, v)
				: getLabel(option) === getLabel(v),
		[isOptionEqualToValue, getLabel]
	);

	const isControlled = value !== undefined;

	const [internalValue, setInternalValue] = useState<T | T[] | null>(() => {
		if (defaultValue !== undefined) return defaultValue;
		return multiple ? [] : null;
	});

	const currentValue = (isControlled ? value : internalValue) as T | T[] | null;

	const [open, setOpen] = useState(false);

	const [inputValue, setInputValue] = useState(() => {
		if (multiple) return "";
		return currentValue && !Array.isArray(currentValue)
			? getLabel(currentValue as T)
			: "";
	});

	const [activeIndex, setActiveIndex] = useState(-1);

	const rootRef = useRef<HTMLDivElement | null>(null);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const listboxRef = useRef<HTMLUListElement | null>(null);

	const isFocusedRef = useRef(false);

	const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const filteredOptions = useMemo(() => {
		const query = inputValue.trim().toLowerCase();

		if (!query) return options;

		return options.filter((option) =>
			getLabel(option).toLowerCase().includes(query)
		);
	}, [options, inputValue, getLabel]);

	const selectedValues = useMemo(() => {
		if (multiple)
			return (Array.isArray(currentValue) ? currentValue : []) as T[];

		return currentValue && !Array.isArray(currentValue)
			? [currentValue as T]
			: [];
	}, [currentValue, multiple]);

	useEffect(() => {
		if (multiple) return;

		if (!isFocusedRef.current) {
			const next =
				currentValue && !Array.isArray(currentValue)
					? getLabel(currentValue as T)
					: "";

			setInputValue(next);
		}
	}, [currentValue, getLabel, multiple]);

	const updateValue = useCallback(
		(
			event: React.SyntheticEvent,
			nextValue: T | T[] | null,
			reason: AutocompleteChangeReason
		) => {
			if (!isControlled) {
				setInternalValue(nextValue);
			}
			if (onChange) {
				if (multiple) {
					(onChange as any)(event, nextValue as T[], reason);
				} else {
					(onChange as any)(event, nextValue as T | null, reason);
				}
			}
		},
		[isControlled, onChange, multiple]
	);

	const selectOption = useCallback(
		(event: React.SyntheticEvent, option: T) => {
			// Clear any pending blur timeout
			if (blurTimeoutRef.current) {
				clearTimeout(blurTimeoutRef.current);
				blurTimeoutRef.current = null;
			}

			if (multiple) {
				const existing = Array.isArray(currentValue) ? currentValue : [];
				const isSelected = existing.some((item) => isEqual(item, option));
				const next = isSelected
					? existing.filter((item) => !isEqual(item, option))
					: [...existing, option];
				updateValue(event, next, isSelected ? "removeOption" : "selectOption");
				setInputValue("");
				setActiveIndex(-1);
				if (disableCloseOnSelect) setOpen(true);
				else setOpen(false);

				return;
			}

			updateValue(event, option, "selectOption");
			setInputValue(getLabel(option));
			if (!disableCloseOnSelect) {
				setOpen(false);
			}
			setActiveIndex(-1);
		},
		[currentValue, getLabel, isEqual, multiple, updateValue]
	);

	const clearValue = useCallback(
		(event: React.SyntheticEvent) => {
			updateValue(event, multiple ? [] : null, "clear");
			setInputValue("");
			setActiveIndex(-1);
		},
		[multiple, updateValue]
	);

	const setInputFocused = useCallback((focused: boolean) => {
		isFocusedRef.current = focused;
	}, []);

	useEffect(() => {
		if (!open || activeIndex < 0 || !listboxRef.current) return;
		const activeId = `autocomplete-option-${activeIndex}`;
		const el = listboxRef.current.querySelector<HTMLElement>(`#${activeId}`);
		if (el) {
			el.scrollIntoView({ block: "nearest" });
		}
	}, [open, activeIndex]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const root = rootRef.current;
			const list = listboxRef.current;
			if (!root) return;

			// Don't close if click is inside root or inside the listbox (supports portal)
			if (root.contains(event.target as Node) || list?.contains(event.target as Node)) return;

			setOpen(false);

			setActiveIndex(-1);
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(event.target.value);
			setOpen(true);
			setActiveIndex(0);

			props.onChange?.(event, event.target.value as any, "selectOption");
		},
		[setInputValue, setOpen, setActiveIndex]
	);

	const handleInputFocus = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			if (!!disabled) return;

			// Clear any pending blur timeout
			if (blurTimeoutRef.current) {
				clearTimeout(blurTimeoutRef.current);
				blurTimeoutRef.current = null;
			}

			setInputFocused(true);
			setOpen(true);
			if (filteredOptions.length > 0) {
				setActiveIndex(0);
			}

			props.onFocus?.(event);
		},
		[
			!!disabled,
			setInputFocused,
			setOpen,
			filteredOptions.length,
			setActiveIndex,
		]
	);

	const handleInputBlur = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			setInputFocused(false);

			// Clear any existing blur timeout
			if (blurTimeoutRef.current) {
				clearTimeout(blurTimeoutRef.current);
			}

			// Close dropdown after a delay to allow clicks on options to register
			blurTimeoutRef.current = setTimeout(() => {
				const root = rootRef.current;
				if (!root) return;

				// If focus moved inside the component (e.g., to listbox), keep open
				if (root.contains(document.activeElement)) return;

				setOpen(false);
				setActiveIndex(-1);
				blurTimeoutRef.current = null;
			}, 150);

			props.onBlur?.(event);
		},
		[setInputFocused, setOpen, setActiveIndex]
	);

	const handleToggleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (!!disabled) return;
			event.preventDefault();
			if (open) {
				setOpen(false);
				setActiveIndex(-1);
				return;
			}
			setOpen(true);
			setActiveIndex(0);
			inputRef.current?.focus();
		},
		[!!disabled, open, setActiveIndex, setOpen, inputRef]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (!!disabled) return;
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setOpen(true);
				setActiveIndex((prev) =>
					Math.min(prev + 1, filteredOptions.length - 1)
				);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setOpen(true);
				setActiveIndex((prev) => Math.max(prev - 1, 0));
				return;
			}
			if (event.key === "Enter") {
				if (!open || activeIndex < 0) return;
				event.preventDefault();
				const option = filteredOptions[activeIndex];
				if (option) {
					selectOption(event, option);
				}
				return;
			}
			if (event.key === "Escape") {
				event.preventDefault();
				setOpen(false);
				setActiveIndex(-1);
				return;
			}
		},
		[
			activeIndex,
			filteredOptions,
			!!disabled,
			open,
			selectOption,
			setActiveIndex,
			setOpen,
		]
	);

	return {
		rootRef,
		inputRef,
		listboxRef,
		open,
		inputValue,
		activeIndex,
		filteredOptions,
		selectedValues,
		getLabel,
		isEqual,
		selectOption,
		clearValue,
		disabled: !!disabled,
		handleToggleClick,
		handleInputChange,
		handleInputFocus,
		handleInputBlur,
		setOpen,
		handleKeyDown,
	};
}
