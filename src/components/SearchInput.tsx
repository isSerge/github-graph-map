import { useRef, useState } from "react";
import { useAutocomplete, Suggestion } from "../hooks/useAutocomplete";

interface SearchInputProps {
  value: string; // current draft value from parent
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear?: () => void;
  history: string[];
  onSelectHistory: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  history,
  placeholder = "Enter repository (e.g., facebook/react) or user (e.g., torvalds)",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, isFetching } = useAutocomplete(value);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // When a suggestion or history item is clicked, commit that value.
  const commitSearch = (item: string) => {
    onChange(item);
    onSubmit(item);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitSearch(value);
    }
  };

  const hasDropdownContent = isFetching || suggestions.length > 0 || history.length > 0;

  return (
    <div className="relative max-w-xl mx-auto mb-4">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-3 pl-10 pr-10 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-150"
      />
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m2.15-4.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      {/* Clear Button */}
      {value && (
        <span
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          aria-label="Clear search input"
        >
          <svg
            className="w-5 h-5 text-gray-400 hover:text-gray-200 transition duration-150"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}
      {/* Dropdown: Show suggestions if available; fallback to history */}
      {showDropdown && hasDropdownContent && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-48 overflow-auto">
          {isFetching && (
            <li className="cursor-pointer px-4 py-2 text-gray-400">Loading...</li>
          )}
          {!isFetching && suggestions.length > 0 ? (
            suggestions.map((item: Suggestion) => (
              <li
                key={item.id}
                onMouseDown={() => commitSearch(item.label)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-700 transition"
              >
                {item.label}
              </li>
            ))
          ) : (
            history.map((item, index) => (
              <li
                key={index}
                onMouseDown={() => commitSearch(item)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-700 transition"
              >
                {item}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;