

// import { useState, useMemo, useEffect } from 'react';
// import { DatabaseRecord } from '../types/searchcustomerpage';

// interface GroupedResult {
//   accountNumber: string;
//   name: string;
//   profile?: DatabaseRecord;
//   transactions: DatabaseRecord[];
// }

// export const useSearch = (records: DatabaseRecord[]) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedTerm, setDebouncedTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Debounce effect: wait 400ms after user stops typing
//   useEffect(() => {
//     setIsLoading(true);
//     const handler = setTimeout(() => {
//       setDebouncedTerm(searchTerm);
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(handler); // Clear timeout on new keystroke
//   }, [searchTerm]);

//   // Grouped & filtered results based on debounced searchTerm
//   const groupedResults = useMemo(() => {
//   if (!debouncedTerm.trim()) return [];

//   const filtered = records.filter(record => {
//     const data = record.data as any;
//     const personName = data["Person's Name"]?.toLowerCase() || '';
//     const accountNumber = data["Account Number"]?.toLowerCase() || '';
//     const term = debouncedTerm.toLowerCase();
//     return personName.includes(term) || accountNumber.includes(term);
//   });

//   const groups: Record<string, GroupedResult> = {};

//   for (const record of filtered) {
//     const data = record.data as any;
//     const accountNumber = data["Account Number"];
//     const personName = data["Person's Name"];

//     if (!accountNumber) continue;

//     if (!groups[accountNumber]) {
//       groups[accountNumber] = {
//         accountNumber,
//         name: personName,
//         profile: undefined,
//         transactions: []
//       };
//     }

//     if (record.type === "profile") {
//       // ✅ Keep only the first profile
//       if (!groups[accountNumber].profile) {
//         groups[accountNumber].profile = record;
//       }
//     } else {
//       // ✅ Keep all transactions, even if identical
//       groups[accountNumber].transactions.push(record);
//     }
//   }

//   return Object.values(groups);
// }, [debouncedTerm, records]);



//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//     setDebouncedTerm('');
//     setIsLoading(false);
//   };

//   return {
//     searchTerm,
//     searchResults: groupedResults,
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
      const data = record.data as any;
      const personName = data["Person's Name"]?.toLowerCase() || '';  
      const accountNumber = data["Account Number"]?.toLowerCase() || '';
      const term = debouncedTerm.toLowerCase();

      return personName.includes(term) || accountNumber.includes(term);   

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
    // Prefer first profile seen
    if (!groups[accountNumber].profile) {
      groups[accountNumber].profile = record;
    }
  } else if (record.type === "transaction") {
    const txId = (record.data as any)["Transaction Number or ID"];
    const alreadyExists = groups[accountNumber].transactions.some(
      tx => (tx.data as any)["Transaction Number or ID"] === txId
    );

    if (!alreadyExists) {
      groups[accountNumber].transactions.push(record);
    }
  }
}


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
