import React, { useState, useMemo, useRef } from 'react';
import { User, FileText, SearchX, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { GroupedResult, ProfileData, TransactionData } from '../../types/searchcustomerpage';
import { ProfileCard } from './ProfileCard';
import { TransactionCard } from './TransactionCard';
import { SpendingSummaryCard } from './SpendingSummaryCard';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Ref remains on the main outer div, even if its visibility changes
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const totalPages = useMemo(() => {
    return Math.ceil(results.length / itemsPerPage);
  }, [results.length, itemsPerPage]);

  const currentResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return results.slice(startIndex, endIndex);
  }, [results, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const handleGoToTop = () => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Common loading/empty states (keep consistent responsive padding) ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
        <p className="text-gray-300">Searching database...</p>
      </div>
    );
  }

  if (!searchTerm) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <SearchX className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Start Your Search</h3>
        <p className="text-gray-400">
          Enter a person's name/Account Number to find their profile and transaction records
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
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
  if (window.innerWidth <= 768) {
    return (
      <div className="flex flex-col items-center justify-center w-[100%]">
        <div className="space-y-8 py-4 sm:p-6 lg:p-8" ref={resultsContainerRef}>

          {/* Header for search results */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4 px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-white text-center sm:text-left">
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
        </div>
        {/* Cards Display */}
        {/* This inner div helps manage spacing between grouped results */}
        <div className="space-y-6">
          {currentResults.map((group) => (
            // Each group container (profile + transactions)
            // On mobile, this div will take up almost full width with minimal horizontal padding
            // On larger screens, the `sm:p-2` on the parent `div.space-y-8` gives it back some padding
            <div
              key={group.accountNumber}
              className="space-y-6 px-0 py-2 sm:px-2 bg-gray-900/50 rounded-lg shadow-md"
            >
              {group.profile && (
                <>
                  <h3 className="text-lg font-semibold text-blue-300 px-4 sm:px-0">Profile Details</h3>
                  <ProfileCard
                    key={`${group.accountNumber}-profile`}
                    data={group.profile.data as ProfileData}
                    timestamp={group.profile.updatedAt}
                  />
                </>
              )}

              {group.transactions.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-violet-300 px-4 sm:px-0">Spending Analysis</h3>
                  <SpendingSummaryCard
                    transactions={group.transactions.map(tx => tx.data as TransactionData)}
                  />

                  <h3 className="text-lg font-semibold text-green-300 px-4 sm:px-0">Transaction Details</h3>
                  <div className="space-y-2">
                    {group.transactions.map((tx, idx) => (
                      <TransactionCard
                        key={`${group.accountNumber}-transaction-${idx}`}
                        data={tx.data as TransactionData}
                        timestamp={tx.updatedAt}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls and Go to Top Button */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 px-4 sm:px-0">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center w-full sm:w-auto justify-center"
            >
              <ChevronLeft className="h-5 w-5 mr-2" /> Previous
            </button>
            <span className="text-gray-300 text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center w-full sm:w-auto justify-center"
            >
              Next <ChevronRight className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={handleGoToTop}
              className="ml-0 sm:ml-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 flex items-center w-full sm:w-auto justify-center"
            >
              <ArrowUp className="h-5 w-5 mr-2" /> Go to Top
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    // The main container. On mobile, it acts as a simple wrapper with vertical spacing.
    // On sm+ screens, it introduces the structured padding.
    // This div will *always* be present, but its styling will change.
    <div className="space-y-8 py-4 sm:p-6 lg:p-8" ref={resultsContainerRef}>

      {/* Header for search results */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4 px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-white text-center sm:text-left">
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

      {/* Cards Display */}
      {/* This inner div helps manage spacing between grouped results */}
      <div className="space-y-6">
        {currentResults.map((group) => (
          // Each group container (profile + transactions)
          // On mobile, this div will take up almost full width with minimal horizontal padding
          // On larger screens, the `sm:p-2` on the parent `div.space-y-8` gives it back some padding
          <div
            key={group.accountNumber}
            className="space-y-6 px-0 py-2 sm:px-2 bg-gray-900/50 rounded-lg shadow-md"
          >
            {group.profile && (
              <>
                <h3 className="text-lg font-semibold text-blue-300 px-4 sm:px-0">Profile Details</h3>
                <ProfileCard
                  key={`${group.accountNumber}-profile`}
                  data={group.profile.data as ProfileData}
                  timestamp={group.profile.updatedAt}
                />
              </>
            )}

            {group.transactions.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-violet-300 px-4 sm:px-0">Spending Analysis</h3>
                <SpendingSummaryCard
                  transactions={group.transactions.map(tx => tx.data as TransactionData)}
                />

                <h3 className="text-lg font-semibold text-green-300 px-4 sm:px-0">Transaction Details</h3>
                <div className="space-y-2">
                  {group.transactions.map((tx, idx) => (
                    <TransactionCard
                      key={`${group.accountNumber}-transaction-${idx}`}
                      data={tx.data as TransactionData}
                      timestamp={tx.updatedAt}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls and Go to Top Button */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 px-4 sm:px-0">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center w-full sm:w-auto justify-center"
          >
            <ChevronLeft className="h-5 w-5 mr-2" /> Previous
          </button>
          <span className="text-gray-300 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center w-full sm:w-auto justify-center"
          >
            Next <ChevronRight className="h-5 w-5 ml-2" />
          </button>
          <button
            onClick={handleGoToTop}
            className="ml-0 sm:ml-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 flex items-center w-full sm:w-auto justify-center"
          >
            <ArrowUp className="h-5 w-5 mr-2" /> Go to Top
          </button>
        </div>
      )}
    </div>
  );
};