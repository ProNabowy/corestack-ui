import * as React from "react";

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  renderItem?: (option: AutocompleteOption) => React.ReactNode;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
}
