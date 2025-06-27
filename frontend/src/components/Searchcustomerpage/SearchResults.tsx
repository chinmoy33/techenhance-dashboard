import React from 'react';
import { DatabaseRecord } from '../../types/searchcustomerpage';
import { ProfileCard } from './ProfileCard';
import { TransactionCard } from './TransactionCard';
import { User, FileText, SearchX } from 'lucide-react';

interface SearchResultsProps {
  results: DatabaseRecord[];
  searchTerm: string;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  searchTerm, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-gray-300">Searching database...</p>
      </div>
    );
  }

  if (!searchTerm) {
    return (
      <div className="text-center py-12">
        <SearchX className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Start Your Search</h3>
        <p className="text-gray-400">Enter a person's name to find their profile and transaction records</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <SearchX className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-200 mb-2">No Results Found</h3>
        <p className="text-gray-400">
          No records found for "<span className="font-medium text-gray-300">{searchTerm}</span>". 
          Try searching with a different name.
        </p>
      </div>
    );
  }

  const profileRecords = results.filter(record => record.type === 'profile');
  const transactionRecords = results.filter(record => record.type === 'transaction');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Search Results for "<span className="text-blue-400">{searchTerm}</span>"
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {profileRecords.length} Profile{profileRecords.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {transactionRecords.length} Transaction{transactionRecords.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {profileRecords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-400" />
            Profile Information
          </h3>
          <div className="space-y-4">
            {profileRecords.map((record) => (
              <ProfileCard
                key={record.id}
                data={record.data as any}
                timestamp={record.updatedAt}
              />
            ))}
          </div>
        </div>
      )}

      {transactionRecords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-400" />
            Transaction History
          </h3>
          <div className="space-y-4">
            {transactionRecords.map((record) => (
              <TransactionCard
                key={record.id}
                data={record.data as any}
                timestamp={record.updatedAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};