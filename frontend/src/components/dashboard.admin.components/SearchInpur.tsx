import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Search...', onChange }) => (
  <div className="relative w-full">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      <FaSearch className="text-gray-400" />
    </span>
    <input
      type="text"
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
    />
  </div>
);

export default SearchInput;