"use client";

import React, { useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { Button } from "../Button";
import { AutocompleteProps, RenderInputParams } from "./Autocomplete.types";
import useAutocomplete from "./hooks/useAutocomplete";
import useDropdownPosition from "./hooks/useDropdownPosition";

export function Autocomplete<T>(props: AutocompleteProps<T>) {
	const {
		renderInput,
		loading,
		disabled,
		multiple,
		placeholder,
		className,
		renderOption,
	} = props;

	const {
		rootRef,
		inputRef,
		listboxRef,
		open,
		setOpen,
		inputValue,
		activeIndex,
		filteredOptions,
		selectedValues,
		getLabel,
		isEqual,
		selectOption,
		clearValue,
		removeOption,
		disabled: isDisabled,
		handleToggleClick,
		handleInputChange,
		handleInputFocus,
		handleInputBlur,
		handleKeyDown,
	} = useAutocomplete<T>(props);

	const onRemove = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>, index: number) => {
			event.stopPropagation();
			const option = selectedValues[index];
			if (!option || !removeOption) return;
			removeOption(event, option);
		},
		[removeOption, selectedValues]
	);

	const listboxId = useMemo(
		() => `autocomplete-listbox-${Math.random().toString(36).slice(2, 9)}`,
		[]
	);

	const startAdornment = useMemo(() => {
		if (!multiple || selectedValues.length === 0) return undefined;
		return (
			<div className="flex flex-wrap gap-1">
				{selectedValues.map((option, index) => (
					<span
						key={`${getLabel(option)}-${index}`}
						className="inline-flex gap-2 items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
					>
						{getLabel(option)}

						<Button type="button" className="w-4" onClick={(event) => onRemove(event, index)}>
							<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
								<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
							</svg>
						</Button>
					</span>
				))}
			</div>
		);
	}, [getLabel, multiple, onRemove, selectedValues]);

	const endAdornment = useMemo(() => {
		return (
			<div className="flex items-center absolute right-3">
				{inputValue ? (
					<Button
						type="button"
						className={`text-xs text-slate-500 hover:text-slate-700 transition hover:bg-gray-25 size-5 rounded-full flex items-center justify-center ${disabled ? "hover:bg-transparent" : ""}`}
						onClick={(event) => {
							event.stopPropagation();
							clearValue(event);
						}}
						aria-label="Clear"
						disabled={isDisabled}
					>
						<svg
							focusable="false"
							aria-hidden="true"
							viewBox="0 0 24 24"
							className="size-4"
						>
							<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
						</svg>
					</Button>
				) : null}

				<Button
					type="button"
					className={`flex items-center text-slate-500 hover:text-slate-700 transition hover:bg-gray-25 size-5 justify-center rounded-full ${disabled ? "hover:bg-transparent" : ""}`}
					onMouseDown={(event) => event.preventDefault()}
					onClick={handleToggleClick}
					aria-label={open ? "Close" : "Open"}
					disabled={isDisabled}
				>
					<span
						className={` transition-transform ${open ? "rotate-180" : "rotate-0"}`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 12 12"
							width="12"
							height="12"
							fill="none"
						>
							<path
								d="M1.5 3.5l4.5 4.5 4.5-4.5"
								stroke="#1E4678"
								stroke-width="1.667"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</Button>
			</div>
		);
	}, [clearValue, handleToggleClick, inputValue, isDisabled, loading, open]);

	const inputParams: RenderInputParams = useMemo(
		() => ({
			...props,
			options: undefined,
			getOptionLabel: undefined,
			ref: inputRef,
			role: "combobox",
			"aria-autocomplete": "list",
			"aria-controls": open ? listboxId : undefined,
			"aria-expanded": open,
			"aria-activedescendant":
				open && activeIndex >= 0
					? `autocomplete-option-${activeIndex}`
					: undefined,
			autocomplete: "off",
			value: inputValue,
			placeholder,
			onChange: handleInputChange,
			onKeyDown: handleKeyDown,
			onFocus: handleInputFocus,
			onBlur: handleInputBlur,

			disabled: isDisabled,
			InputProps: {
				endAdornment,
				className: "min-h-[40px]",
			},
		}),
		[
			activeIndex,
			endAdornment,
			handleInputBlur,
			handleInputChange,
			handleInputFocus,
			handleKeyDown,
			inputValue,
			isDisabled,
			listboxId,
			open,
			placeholder,
			startAdornment,
		]
	);

	if (!renderInput) {
		return <p>Render Input Prop Must be pass </p>;
	}

	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const { position } = useDropdownPosition(() => rootRef.current, listboxRef);

	return (
		<div
			ref={rootRef}
			onClick={() => {
				if (!open) {
					setOpen(true);
				}
			}}
			className={`${className} [&_.input-container]:pe-[54px] [&_.input-container]:gap-0`}
		>
			<div className="flex flex-col gap-2">
				{renderInput(inputParams)}
				{startAdornment}
			</div>

			{open || (open && loading)
				? (() => {
						const portalNode = document.body;
						const dropdown = (
							<div
								ref={wrapperRef}
								className="p-1.5 rounded-md border border-slate-200 bg-white shadow-lg"
								style={{
									position: "fixed",
									top: position ? position.top : 0,
									left: position ? position.left : 0,
									width: position ? position.width : undefined,
									minWidth: position ? position.width : undefined,
									zIndex: 1300,
									visibility: position ? "visible" : "hidden",
								}}
							>
								<ul
									id={listboxId}
									ref={listboxRef}
									role="listbox"
									className="max-h-60 sm:max-h-[325px] w-full overflow-auto "
								>
									{loading ? (
										<svg
											aria-hidden="true"
											className="w-4 h-4 m-auto animate-spin dark:text-gray-500 fill-primary-700 dark:fill-white"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
									) : filteredOptions.length === 0 ? (
										<li className="px-3 py-2 text-sm text-slate-500">
											No Options
										</li>
									) : (
										filteredOptions.map((option, index) => {
											const selected = selectedValues.some((item) =>
												isEqual(item, option)
											);
											const optionProps: React.HTMLAttributes<HTMLLIElement> = {
												id: `autocomplete-option-${index}`,
												role: "option",
												"aria-selected": selected,
												className:
													"cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 " +
													(index === activeIndex ? "bg-slate-100 " : "") +
													(selected ? "bg-slate-50 font-medium text-slate-900" : ""),
												onMouseDown: (event) => event.preventDefault(),
												onClick: (event) => selectOption(event, option),
											};

											return renderOption ? (
												renderOption(optionProps, option, { selected, index })
											) : (
												<li
													key={`${getLabel(option)}-${index}`}
													{...optionProps}
												>
													{getLabel(option)}
												</li>
											);
										})
									)}
								</ul>
							</div>
						);

						return portalNode
							? ReactDOM.createPortal(dropdown, portalNode)
							: dropdown;
					})()
				: null}
		</div>
	);
}
