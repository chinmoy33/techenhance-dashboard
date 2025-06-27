import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer'; // optional for responsive sizing
//import { GroupedResult } from '../../types/searchcustomerpage';
import { ProfileCard } from './ProfileCard';
import { TransactionCard } from './TransactionCard';
import { User, FileText, SearchX } from 'lucide-react';
import { GroupedResult, ProfileData , TransactionData } from '../../types/searchcustomerpage';

interface SearchResultsProps {
  results: GroupedResult[];
  searchTerm: string;
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchTerm,
  isLoading,
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
        <p className="text-gray-400">
          Enter a person's name to find their profile and transaction records
        </p>
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

  const profileCount = results.filter((group) => group.profile).length;
  const transactionCount = results.reduce((acc, group) => acc + group.transactions.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Search Results for "<span className="text-blue-400">{searchTerm}</span>"
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {profileCount} Profile{profileCount !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {transactionCount} Transaction{transactionCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Virtualized List */}
      <div style={{ height: '80vh' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={results.length}
              itemSize={1900} // Adjust based on average item height
              width={width}
            >
              {({ index , style }) => {
                const group = results[index];
                return (
                  <div key={group.accountNumber} style={style} className="space-y-6 p-2">
                    {group.profile && (
                      <>
                        <h3 className="text-lg font-semibold text-blue-300">Profile Details</h3>
                        <ProfileCard
                          key={`${group.accountNumber}-profile`}
                          data={group.profile.data as ProfileData}
                          timestamp={group.profile.updatedAt}
                        />
                      </>
                    )}
                    {group.transactions.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold text-green-300">Transaction Details</h3>
                      <div className="space-y-2">
                        {group.transactions.map((tx, idx) => (
                          <TransactionCard
                            key={`${group.accountNumber}-${idx}`}
                            data={tx.data as TransactionData}
                            timestamp={tx.updatedAt}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
