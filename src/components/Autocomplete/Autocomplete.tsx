import * as React from "react";
import { cn } from "../../utils";
import { AutocompleteProps } from "./Autocomplete.types";
import { useAutocomplete } from "./hooks";

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder,
  renderItem,
  className,
  inputClassName,
  listClassName,
  itemClassName,
}) => {
  const { input, setInput, filtered } = useAutocomplete(options);

  React.useEffect(() => {
    if (value === undefined) return;
    setInput(value);
  }, [value, setInput]);

  const baseRootClass = "relative w-full";
  const baseInputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";
  const baseListClass =
    "absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow";
  const baseItemClass = "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100";

  return (
    <div className={cn(baseRootClass, className)}>
      <input
        className={cn(baseInputClass, inputClassName)}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onChange?.(e.target.value || undefined);
        }}
        placeholder={placeholder}
      />
      <ul className={cn(baseListClass, listClassName)}>
        {filtered.map((opt) => (
          <li key={opt.value} className={cn(baseItemClass, itemClassName)}>
            {renderItem ? renderItem(opt) : opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
