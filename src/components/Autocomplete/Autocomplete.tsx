import * as React from "react";
import { AutocompleteProps } from "./Autocomplete.types";
import { useAutocomplete } from "./hooks";

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder,
  renderItem,
}) => {
  const { input, setInput, filtered } = useAutocomplete(options);

  React.useEffect(() => {
    if (value === undefined) return;
    setInput(value);
  }, [value]);

  return (
    <div className="cs-autocomplete">
      <input
        className="cs-autocomplete__input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          onChange?.(e.target.value || undefined);
        }}
        placeholder={placeholder}
      />
      <ul className="cs-autocomplete__list">
        {filtered.map((opt) => (
          <li key={opt.value} className="cs-autocomplete__item">
            {renderItem ? renderItem(opt) : opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
