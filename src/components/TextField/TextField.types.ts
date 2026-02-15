type TextFieldSize = "small" | "medium";

type TextFieldVariant = "outlined" | "filled" | "standard";

type TextFieldInputProps = {
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	inputComponent?: React.ElementType;
	className?: string;
};

export type TextFieldProps = {
	value?: string | number | null | readonly string[];
	defaultValue?: string | number | readonly string[];
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	placeholder?: string;
	label?: string | React.ReactNode;
	helperText?: string | false | undefined;
	error?: boolean;
	disabled?: boolean;
	required?: boolean;
	multiline?: boolean;
	rows?: number;
	type?: string;
	name?: string;
	id?: string;
	fullWidth?: boolean;
	size?: TextFieldSize;
	variant?: TextFieldVariant;
	InputProps?: TextFieldInputProps;
	className?: string;
} & Omit<
	React.InputHTMLAttributes<HTMLInputElement> &
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	| "size"
	| "type"
	| "onChange"
	| "value"
	| "defaultValue"
	| "disabled"
	| "required"
	| "name"
	| "id"
	| "placeholder"
	| "onBlur"
	| "onFocus"
>;
