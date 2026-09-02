"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

import { useDebounce } from "@/hooks/use-debounce";

/**
 * Debounced search box backed by the `search` URL param (?search=…).
 * Updates are debounced so each keystroke does not rewrite the URL/history.
 * `onDebouncedChange` fires together with the debounced search commit —
 * callers use it to reset pagination when the query changes.
 */
export function SearchInput({
  label,
  placeholder,
  debounceMs = 500,
  onDebouncedChange,
}: {
  label: string;
  placeholder: string;
  debounceMs?: number;
  onDebouncedChange?: (value: string) => void;
}) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const inputId = useId();

  const [inputValue, setInputValue] = useState(search);

  const setSearchDebounced = useDebounce(
    (value: string) => {
      setSearch(value);
      onDebouncedChange?.(value);
    },
    debounceMs,
  );

  // Sync URL → local input. Adjusted during render (React's recommended
  // pattern for adjusting state when a prop changes) instead of in an
  // effect, which would trip react-hooks/set-state-in-effect.
  const [prevSearch, setPrevSearch] = useState(search);
  if (prevSearch !== search) {
    setPrevSearch(search);
    setInputValue(search);
  }

  const handleChange = (value: string) => {
    setInputValue(value);
    setSearchDebounced(value);
  };

  return (
    <div className="relative max-w-md">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
      />
    </div>
  );
}
