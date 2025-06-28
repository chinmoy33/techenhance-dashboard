// pages/Searchcustomerpage.tsx
import { SearchBar } from "../components/Searchcustomerpage/SearchBar";
import { SearchResults } from "../components/Searchcustomerpage/SearchResults";
import { useSearch } from "../hooks/useSearch";
import { Database } from "lucide-react";
import { DatabaseRecord } from "../types/searchcustomerpage";

interface SearchcustomerpageProps {
  records: DatabaseRecord[];
}

function Searchcustomerpage({ records }: SearchcustomerpageProps) {
  const { searchTerm, searchResults, isLoading, handleSearch, clearSearch } =
    useSearch(records); // ✅ use actual data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Database className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-start">
              <h1 className="text-3xl font-bold text-white">
                Person Database Search
              </h1>
              <p className="text-gray-300 mt-1">
                Search for profiles and transaction records by name or account number
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            onClear={clearSearch}
            isLoading={isLoading}
          />
        </div>

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
// Searchcustomerpage.tsx (updated version)
// import { useEffect, useState } from "react";
// import { Database } from "lucide-react";
// import { dataService } from "../services/dataService";
// import { DatabaseRecord } from "../types/searchcustomerpage";
// import { SearchBar } from "../components/Searchcustomerpage/SearchBar";
// import { SearchResults } from "../components/Searchcustomerpage/SearchResults";
// import { useSearch } from "../hooks/useSearch";

// function Searchcustomerpage({ datasetIds }: { datasetIds: number[] }) {
//   const [records, setRecords] = useState<DatabaseRecord[]>([]);
//   const [loadingDatasets, setLoadingDatasets] = useState(true);

//   const {
//     searchTerm,
//     searchResults,
//     isLoading: isSearching,
//     handleSearch,
//     clearSearch
//   } = useSearch(records);

//   useEffect(() => {
//     const fetchAllDatasets = async () => {
//       try {
//         const all = await Promise.all(
//           datasetIds.map(async (id) => {
//             const dataset = await dataService.getDataset(id);
//             return dataset.data.map((entry: any, index: number) => ({
//               id: Number(`${dataset.id}${index}`),
//               name: dataset.name,
//               data: entry,
//               type: dataset.name.toLowerCase().includes("transaction") ? "transaction" : "profile",
//               createdAt: dataset.createdAt,
//               updatedAt: dataset.updatedAt || dataset.createdAt,
//             }));
//           })
//         );
//         setRecords(all.flat());
//       } catch (err) {
//         console.error("Failed to fetch datasets for search page", err);
//       } finally {
//         setLoadingDatasets(false);
//       }
//     };

//     fetchAllDatasets();
//   }, [datasetIds]);

//   if (loadingDatasets) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-300">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
//           <p>Loading all datasets for search...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
//       {/* Header */}
//       <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl border-b border-gray-700/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-center space-x-3">
//             <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
//               <Database className="h-8 w-8 text-blue-400" />
//             </div>
//             <div className="text-start">
//               <h1 className="text-3xl font-bold text-white">
//                 Person Database Search
//               </h1>
//               <p className="text-gray-300 mt-1">
//                 Search for profiles and transaction records by name or account number
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <SearchBar
//             value={searchTerm}
//             onChange={handleSearch}
//             onClear={clearSearch}
//             isLoading={isSearching}
//           />
//         </div>

//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 md:p-8">
//           <SearchResults
//             results={searchResults}
//             searchTerm={searchTerm}
//             isLoading={isSearching}
//           />
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-16 bg-gray-800/30 border-t border-gray-700/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <p className="text-center text-gray-400 text-sm">
//             Search through customer profiles and transaction records efficiently
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Searchcustomerpage;
