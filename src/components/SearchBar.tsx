import React from 'react';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = 'Поиск по фамилии или телефону...' }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Icon 
        name="Search" 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full"
      />
    </div>
  );
};

export default SearchBar;