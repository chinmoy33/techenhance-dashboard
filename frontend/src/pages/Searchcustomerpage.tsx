//import { SearchBar } from '../components/Searchcustomerpage/SearchBar';
import {SearchBar} from "../components/Searchcustomerpage/SearchBar"
import { SearchResults } from '../components/Searchcustomerpage/SearchResults';
import { useSearch } from '../hooks/useSearch';
import { Database } from 'lucide-react';

function Searchcustomerpage() {
  const { searchTerm, searchResults, isLoading, handleSearch, clearSearch } = useSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Database className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">
                Person Database Search
              </h1>
              <p className="text-gray-300 mt-1">
                Search for profiles and transaction records by name
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            onClear={clearSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Results Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 md:p-8">
          <SearchResults
            results={searchResults}
            searchTerm={searchTerm}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 bg-gray-800/30 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400 text-sm">
            Search through customer profiles and transaction records efficiently
          </p>
        </div>
      </div>
    </div>
  );
}

export default Searchcustomerpage;

