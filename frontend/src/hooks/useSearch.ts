// import { useState, useEffect, useMemo } from 'react';
// import { DatabaseRecord } from '../types/searchcustomerpage';
// import { mockDatabase } from '../data/mockDatabase';

// export const useSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const searchResults = useMemo(() => {
//     if (!searchTerm.trim()) return [];
    
//     return mockDatabase.filter(record => 
//       record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (record.data as any)["Person's Name"]?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm]);

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (term.trim()) {
//       setIsLoading(true);
//       // Simulate API delay
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 500);
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setIsLoading(false);
//   };

//   return {
//     searchTerm,
//     searchResults,
//     isLoading,
//     handleSearch,
//     clearSearch,
//   };
// };

// hooks/useSearch.ts



// import { useState, useMemo } from 'react';
// import { DatabaseRecord } from '../types/searchcustomerpage';

// export const useSearch = (records: DatabaseRecord[]) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const searchResults = useMemo(() => {
//     if (!searchTerm.trim()) return [];
//     return records.filter(record =>
//       record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (record.data as any)["Person's Name"]?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm, records]);

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (term.trim()) {
//       setIsLoading(true);
//       setTimeout(() => setIsLoading(false), 500); // simulate delay
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setIsLoading(false);
//   };

//   return {
//     searchTerm,
//     searchResults,
//     isLoading,
//     handleSearch,
//     clearSearch,
//   };
// };


// import { useState, useMemo } from 'react';
// import { DatabaseRecord } from '../types/searchcustomerpage';

// export const useSearch = (records: DatabaseRecord[]) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const searchResults = useMemo(() => {
//     if (!searchTerm.trim()) return [];

//     const filtered = records.filter(record =>
//       record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (record.data as any)["Person's Name"]?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // ✅ Deduplicate based on ID and type (or full content)
//     const uniqueMap = new Map<string, DatabaseRecord>();
//     filtered.forEach(record => {
//       const key = `${record.id}-${record.type}`; // adjust key logic if needed
//       if (!uniqueMap.has(key)) {
//         uniqueMap.set(key, record);
//       }
//     });

//     return Array.from(uniqueMap.values());
//   }, [searchTerm, records]);

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (term.trim()) {
//       setIsLoading(true);
//       setTimeout(() => setIsLoading(false), 500); // simulate delay
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setIsLoading(false);
//   };

//   return {
//     searchTerm,
//     searchResults,
//     isLoading,
//     handleSearch,
//     clearSearch,
//   };
// };

// import { useState, useMemo } from 'react';
// import { DatabaseRecord } from '../types/searchcustomerpage';

// interface GroupedResult {
//   accountNumber: string;
//   name: string;
//   profile?: DatabaseRecord;
//   transactions: DatabaseRecord[];
// }

// export const useSearch = (records: DatabaseRecord[]) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const groupedResults = useMemo(() => {
//     if (!searchTerm.trim()) return [];

//     const filtered = records.filter(record => {
//       const personName = (record.data as any)["Person's Name"]?.toLowerCase() || '';
//       return personName.includes(searchTerm.toLowerCase());
//     });

//     const groups: Record<string, GroupedResult> = {};

//     for (const record of filtered) {
//       const accountNumber = (record.data as any)["Account Number"];
//       const personName = (record.data as any)["Person's Name"];

//       if (!groups[accountNumber]) {
//         groups[accountNumber] = {
//           accountNumber,
//           name: personName,
//           profile: undefined,
//           transactions: []
//         };
//       }

//       if (record.type === "profile") {
//         groups[accountNumber].profile = record;
//       } else {
//         groups[accountNumber].transactions.push(record);
//       }
//     }

//     return Object.values(groups);
//   }, [searchTerm, records]);

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     if (term.trim()) {
//       setIsLoading(true);
//       setTimeout(() => setIsLoading(false), 500);
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setIsLoading(false);
//   };

//   return {
//     searchTerm,
//     searchResults: groupedResults, // now returns grouped by account
//     isLoading,
//     handleSearch,
//     clearSearch
//   };
// };

import { useState, useMemo, useEffect } from 'react';
import { DatabaseRecord } from '../types/searchcustomerpage';

interface GroupedResult {
  accountNumber: string;
  name: string;
  profile?: DatabaseRecord;
  transactions: DatabaseRecord[];
}

export const useSearch = (records: DatabaseRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce effect: wait 400ms after user stops typing
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(handler); // Clear timeout on new keystroke
  }, [searchTerm]);

  // Grouped & filtered results based on debounced searchTerm
  const groupedResults = useMemo(() => {
    if (!debouncedTerm.trim()) return [];

    const filtered = records.filter(record => {
      const personName = (record.data as any)["Person's Name"]?.toLowerCase() || '';
      return personName.includes(debouncedTerm.toLowerCase());
    });

    const groups: Record<string, GroupedResult> = {};

    for (const record of filtered) {
      const accountNumber = (record.data as any)["Account Number"];
      const personName = (record.data as any)["Person's Name"];

      if (!accountNumber) continue;

      if (!groups[accountNumber]) {
        groups[accountNumber] = {
          accountNumber,
          name: personName,
          profile: undefined,
          transactions: []
        };
      }

      if (record.type === "profile") {
        groups[accountNumber].profile = record;
      } else {
        groups[accountNumber].transactions.push(record);
      }
    }
//     for (const record of filtered) {
//   const accountNumber = (record.data as any)["Account Number"];
//   const personName = (record.data as any)["Person's Name"];

//   if (!accountNumber) continue;

//   if (!groups[accountNumber]) {
//     groups[accountNumber] = {
//       accountNumber,
//       name: personName,
//       profile: undefined,
//       transactions: []
//     };
//   }

//   if (record.type === "profile") {
//     // Prefer first profile seen
//     if (!groups[accountNumber].profile) {
//       groups[accountNumber].profile = record;
//     }
//   } else if (record.type === "transaction") {
//     const txId = (record.data as any)["Transaction Number or ID"];
//     const alreadyExists = groups[accountNumber].transactions.some(
//       tx => (tx.data as any)["Transaction Number or ID"] === txId
//     );

//     if (!alreadyExists) {
//       groups[accountNumber].transactions.push(record);
//     }
//   }
// }


    return Object.values(groups);
  }, [debouncedTerm, records]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedTerm('');
    setIsLoading(false);
  };

  return {
    searchTerm,
    searchResults: groupedResults,
    isLoading,
    handleSearch,
    clearSearch
  };
};

