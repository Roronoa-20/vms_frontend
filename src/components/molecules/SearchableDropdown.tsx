import { useState, useEffect, useRef } from "react";

export type DropdownItem = {
  id: string | number;
  name: string;
};

type SearchableDropdownProps = {
  fetchResults: (query: string) => Promise<DropdownItem[]>;
  containerClass?: string;
  inputClass?: string;
  listClass?: string;
  itemClass?: string;
  noResultClass?: string;
  debounceMs?: number;
  placeholder?: string;
};

export default function SearchableDropdown({
  fetchResults,
  containerClass = "w-80 relative",
  inputClass = "w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
  listClass = "absolute z-50 mt-1 w-full bg-white border rounded-lg shadow max-h-60 overflow-y-auto",
  itemClass = "px-3 py-2 cursor-pointer hover:bg-blue-50",
  noResultClass = "px-3 py-2 text-gray-500",
  debounceMs = 300,
  placeholder = "Search...",
}: SearchableDropdownProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<DropdownItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        const data = await fetchResults(query);
        setResults(data);
        setOpen(true);
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
        setOpen(false);
      }
    }, debounceMs);
  }, [query, fetchResults, debounceMs]);

  function selectItem(item: DropdownItem) {
    setQuery(item.name);
    setOpen(false);
  }

  return (
    <div className={containerClass}>
      <input
        className={inputClass}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
      />

      {open && (
        <ul className={listClass}>
          {results.length === 0 && (
            <li className={noResultClass}>No results found</li>
          )}

          {results.map((item) => (
            <li
              key={item.id}
              className={itemClass}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectItem(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
