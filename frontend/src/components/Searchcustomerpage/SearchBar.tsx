import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  onClear, 
  isLoading 
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center z-10">
          <Search
            className={`h-5 w-5 transition-colors duration-200 pointer-events-none ${
              isLoading ? 'text-blue-400 animate-pulse' : 'text-white'
            }`}
          />
        </div>

        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type to search..."
          className="block w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-600 rounded-xl 
                   focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200
                   bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl placeholder-gray-400 text-white"
        />
        
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 
                     hover:text-gray-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};