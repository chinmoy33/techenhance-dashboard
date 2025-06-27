import { useState, useEffect, useMemo } from 'react';
import { DatabaseRecord } from '../types/searchcustomerpage';
import { mockDatabase } from '../data/mockDatabase';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return mockDatabase.filter(record => 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.data as any)["Person's Name"]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsLoading(false);
  };

  return {
    searchTerm,
    searchResults,
    isLoading,
    handleSearch,
    clearSearch,
  };
};


