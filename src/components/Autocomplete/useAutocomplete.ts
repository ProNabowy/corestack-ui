import { useState, useMemo } from 'react';
import type { AutocompleteOption } from './Autocomplete.types';

export function useAutocomplete(options: AutocompleteOption[]) {
  const [input, setInput] = useState('');

  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [input, options]);

  return { input, setInput, filtered } as const;
}
