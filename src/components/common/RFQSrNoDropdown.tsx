"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "../atoms/input";

interface RFQOption {
  name: string;
  sr_no: string;
}

interface RFQDropdownProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (option: RFQOption) => void;
  options: RFQOption[];
  placeholder?: string;
  autoClearFields: () => void;
  disabled?: boolean;
}

export default function RFQDropdown({
  value,
  onChange,
  onSelect,
  options,
  placeholder = "Type to search RFQ...",
  autoClearFields,
  disabled = false,
}: RFQDropdownProps) {
  const [filteredOptions, setFilteredOptions] = useState<RFQOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, []);

  const handleInputChange = (typed: string) => {
    onChange(typed);

    if (!typed) {
      setFilteredOptions([]);
      setDropdownOpen(false);
      setHighlightedIndex(-1);

      autoClearFields();
      return;
    }

    const filtered = options.filter((r) =>
      r.sr_no.toLowerCase().includes(typed.toLowerCase())
    );
    setFilteredOptions(filtered);
    setDropdownOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        const selected = filteredOptions[highlightedIndex];
        onSelect(selected);
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative w-[27%]" ref={dropdownRef}>
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="border border-gray-300 rounded-md px-3 py-2"
      />

      {dropdownOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-48 overflow-y-auto rounded-md shadow-md">
          {filteredOptions.map((rfq, idx) => (
            <li
              key={rfq.name}
              className={`px-3 py-2 cursor-pointer ${
                highlightedIndex === idx ? "bg-gray-200" : ""
              }`}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onClick={() => {
                onSelect(rfq);
                setDropdownOpen(false);
                setHighlightedIndex(-1);
              }}
            >
              {rfq.sr_no}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
