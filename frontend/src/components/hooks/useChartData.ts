// // Data processing and chart options hook
// import { useMemo, useCallback } from "react";
// import { ChartConfig, Dataset } from "../../types";
// import { chartTypes } from "../constants/ChartConstants";

// import {
//   generateCategoricalChartData,
//   generateScatterChartData,
//   generateRadarChartData,
//   generateHistogramChartData,
//   generateLineBarChartData,
//   getCompatibleChartTypes,
// } from "../utils/chartDataUtils";
// import { getChartOptions } from "../utils/chartOptions";
// import { throttle } from "lodash";

// export interface AttributeInfo {
//   name: string;
//   type: "number" | "string" | "date";
// }

// export const useChartData = (
//   dataset: Dataset,
//   selectedChartType: ChartConfig["type"],
//   selectedAttributes: string[],
//   selectedRange: [number, number],
//   setSelectedRange: (range: [number, number]) => void,
//   chartConfig: ChartConfig,
//   isFullscreen: boolean,
//   attributeTypes: AttributeInfo[] // New parameter to receive attribute types
// ) => {
//   // Determine if the first selected attribute is categorical
//   const isCategorical = useMemo(() => {
//     if (selectedAttributes.length === 0) return false;
//     const attr = attributeTypes.find((a) => a.name === selectedAttributes[0]);
//     return attr?.type === "string";
//   }, [selectedAttributes, attributeTypes]);

//   // Sort data based on the first selected attribute
//   const sortedDataAndIndices = useMemo(() => {
//     if (!dataset.data || selectedAttributes.length === 0) {
//       return {
//         sortedData: dataset.data,
//         originalIndices: dataset.data?.map((_, i) => i) || [],
//       };
//     }

//     const attr = selectedAttributes[0];
//     const attrType =
//       attributeTypes.find((a) => a.name === attr)?.type || "string";

//     if (attrType === "string") {
//       // For categorical attributes, return unsorted data
//       return {
//         sortedData: dataset.data,
//         originalIndices: dataset.data.map((_, i) => i),
//       };
//     }

//     // For numerical or date attributes, sort in ascending order
//     const sortedData = [...dataset.data];
//     const originalIndices = dataset.data.map((_, i) => i);

//     sortedData.sort((a, b) => {
//       const valA = a[attr];
//       const valB = b[attr];

//       if (attrType === "date") {
//         const dateA = new Date(valA);
//         const dateB = new Date(valB);
//         return dateA.getTime() - dateB.getTime();
//       }

//       const numA = Number(valA);
//       const numB = Number(valB);
//       return numA - numB;
//     });
//     if(attrType==="date")
//     console.log("checking sorteddata for dates:",sortedData);

//     // Update originalIndices to reflect sorted order
//     const sortedIndices = sortedData.map((item, index) => {
//       return dataset.data.findIndex(
//         (d, i) => d === item && originalIndices[i] !== undefined
//       );
//     });

//     return { sortedData, originalIndices: sortedIndices };
//   }, [dataset.data, selectedAttributes, attributeTypes]);

//   const getFilteredData = useMemo(() => {
//     if (!dataset.data || selectedAttributes.length === 0) return dataset.data;

//     // Filter only selected attributes
//     const baseData = sortedDataAndIndices.sortedData.map((row) => {
//       const filteredRow: any = {};
//       selectedAttributes.forEach((attr) => {
//         filteredRow[attr] = row[attr];
//       });
//       return filteredRow;
//     });

//     // Apply range filter for supported chart types
//     const currentChartType = chartTypes.find(
//       (ct) => ct.type === selectedChartType
//     );
//     if (
//       currentChartType?.supportsRange &&
//       selectedRange[0] !== selectedRange[1] &&
//       !isCategorical
//     ) {
//       const selectedIndices = sortedDataAndIndices.originalIndices.slice(
//         selectedRange[0],
//         selectedRange[1] + 1
//       );
//       return selectedIndices
//         .map((index) => dataset.data[index])
//         .map((row) => {
//           const filteredRow: any = {};
//           selectedAttributes.forEach((attr) => {
//             filteredRow[attr] = row[attr];
//           });
//           return filteredRow;
//         });
//     }

//     // Downsample the filtered result to a max of 1000 rows
//     const downsampleToSize = (data: any[], maxPoints: number): any[] => {
//       const sampleRate = Math.ceil(data.length / maxPoints);
//       return data.filter((_, index) => index % sampleRate === 0);
//     };
//     if (baseData.length > 1000) {
//       return downsampleToSize(baseData, 1000);
//     } else {
//       return baseData;
//     }
//   }, [
//     dataset.data,
//     selectedAttributes,
//     selectedRange,
//     selectedChartType,
//     sortedDataAndIndices,
//     isCategorical,
//   ]);

//   const getChartData = useCallback(
//     (chartType: ChartConfig["type"]) => {
//       if (!getFilteredData || getFilteredData.length === 0) return null;

//       switch (chartType) {
//         case "pie":
//           return generateCategoricalChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         case "scatter":
//           return generateScatterChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         case "radar":
//           return generateRadarChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         case "histogram":
//           return generateHistogramChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         default:
//           return generateLineBarChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || [],
//             chartType,
//             dataset.name
//           );
//       }
//     },
//     [getFilteredData, selectedAttributes, chartConfig.colors, dataset.name]
//   );

//   // ===== MEMOIZED VALUES =====
//   const chartData = useMemo(
//     () => getChartData(selectedChartType),
//     [getChartData, selectedChartType]
//   );

//   const compatibleChartTypes = useMemo(
//     () => getCompatibleChartTypes(dataset, selectedAttributes),
//     [dataset, selectedAttributes]
//   );

//   const rangeLabels = useMemo(() => {
//     if (!dataset.data || selectedAttributes.length === 0) return [];
//     const labelAttr = selectedAttributes[0];
//     return sortedDataAndIndices.sortedData.map(
//       (item, index) => item[labelAttr] || `Point ${index + 1}`
//     );
//   }, [dataset.data, selectedAttributes, sortedDataAndIndices]);

//   const currentChartType = chartTypes.find(
//     (ct) => ct.type === selectedChartType
//   );
//   const supportsRangeSelector =
//     currentChartType?.supportsRange &&
//     dataset.data &&
//     dataset.data.length > 1 &&
//     !isCategorical;

//   const chartOptions = useMemo(
//     () =>
//       getChartOptions(
//         selectedChartType,
//         selectedAttributes.length === 1,
//         selectedAttributes[0],
//         selectedAttributes.slice(1),
//         dataset.name,
//         chartConfig,
//         isFullscreen
//       ),
//     [
//       selectedChartType,
//       selectedAttributes,
//       dataset.name,
//       chartConfig,
//       isFullscreen,
//     ]
//   );

//   const handleRangeChange = useCallback(
//     (range: [number, number]) => {
//       setSelectedRange(range); // Now uses the passed setSelectedRange
//     },
//     [setSelectedRange]
//   );

//   const throttledHandleRangeChange = useMemo(
//     () => throttle(handleRangeChange, 16),
//     [handleRangeChange]
//   );

//   return {
//     chartData,
//     compatibleChartTypes,
//     rangeLabels,
//     supportsRangeSelector,
//     chartOptions,
//     getChartData,
//     throttledHandleRangeChange,
//   };
// };


// Data processing and chart options hook
// Data processing and chart options hook
// Add this helper function outside of your useChartData hook,
// or inside if you prefer, but it should be a standalone utility.
// const parseDDMMYYYY = (dateString: string): Date => {
//   if (!dateString) return new Date(NaN); // Handle empty/null strings
//   const parts = dateString.split('/');
//   // Note: Month is 0-indexed in Date constructor, so parts[1] - 1
//   return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
// };
// import { useMemo, useCallback } from "react";
// import { ChartConfig, Dataset } from "../../types";
// import { chartTypes } from "../constants/ChartConstants";

// import {
//   generateCategoricalChartData,
//   generateScatterChartData,
//   generateRadarChartData,
//   generateHistogramChartData,
//   generateLineBarChartData,
//   getCompatibleChartTypes,
// } from "../utils/chartDataUtils";
// import { getChartOptions } from "../utils/chartOptions";
// import { throttle } from "lodash";

// export interface AttributeInfo {
//   name: string;
//   type: "number" | "string" | "date";
// }

// export const useChartData = (
//   dataset: Dataset,
//   selectedChartType: ChartConfig["type"],
//   selectedAttributes: string[],
//   selectedRange: [number, number],
//   setSelectedRange: (range: [number, number]) => void,
//   chartConfig: ChartConfig,
//   isFullscreen: boolean,
//   attributeTypes: AttributeInfo[] // New parameter to receive attribute types
// ) => {

  
//   // Determine if the first selected attribute is categorical
//   const isCategorical = useMemo(() => {
//     if (selectedAttributes.length === 0) return false;
//     const attr = attributeTypes.find((a) => a.name === selectedAttributes[0]);
//     return attr?.type === "string";
//   }, [selectedAttributes, attributeTypes]);

//   // Sort data based on the first selected attribute (only if not categorical)
//   const sortedDataAndIndices = useMemo(() => {
//     if (!dataset.data || selectedAttributes.length === 0) {
//       return {
//         sortedData: dataset.data,
//         originalIndices: dataset.data?.map((_, i) => i) || [],
//       };
//     }

//     const attr = selectedAttributes[0];
//     const attrType =
//       attributeTypes.find((a) => a.name === attr)?.type || "string";

//     if (attrType === "string") {
//       return {
//         sortedData: dataset.data,
//         originalIndices: dataset.data.map((_, i) => i),
//       };
//     }

//     const dataWithOriginalIndex = dataset.data.map((item, index) => ({
//       item,
//       originalIndex: index,
//     }));

//     dataWithOriginalIndex.sort((a, b) => {
//       const valA = a.item[attr];
//       const valB = b.item[attr];

//       if (attrType === "date") {
//         // *** CHANGE HERE: Use the custom parsing function ***
//         const dateA = parseDDMMYYYY(valA);
//         const dateB = parseDDMMYYYY(valB);

//         // Handle invalid dates by pushing them to the end (for ascending sort)
//         if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
//         if (isNaN(dateA.getTime())) return 1; // dateA is invalid, push to end
//         if (isNaN(dateB.getTime())) return -1; // dateB is invalid, push to end

//         return dateA.getTime() - dateB.getTime();
//       }

//       const numA = Number(valA);
//       const numB = Number(valB);

//       // Handle NaN for numerical comparison (e.g., push to end)
//       if (isNaN(numA) && isNaN(numB)) return 0;
//       if (isNaN(numA)) return 1; // numA is NaN, push to end
//       if (isNaN(numB)) return -1; // numB is NaN, push to end

//       return numA - numB;
//     });

//     const sortedData = dataWithOriginalIndex.map((entry) => entry.item);
//     const originalIndices = dataWithOriginalIndex.map(
//       (entry) => entry.originalIndex
//     );

//     if (attrType === "date") {
//       console.log("Sorted data for dates (DD/MM/YYYY parsed):", sortedData);
//       console.log("Original indices after date sort:", originalIndices);
//     }

//     return { sortedData, originalIndices };
//   }, [dataset.data, selectedAttributes, attributeTypes]);

//   // Memoized function to get filtered data
//   const getFilteredData = useMemo(() => {
//     if (!dataset.data || selectedAttributes.length === 0) return []; // Return empty array if no data or attributes

//     let dataToProcess = sortedDataAndIndices.sortedData;

//     // Apply range filter *directly* to the already sorted data
//     const currentChartType = chartTypes.find(
//       (ct) => ct.type === selectedChartType
//     );
//     if (
//       currentChartType?.supportsRange &&
//       selectedRange[0] !== selectedRange[1] &&
//       !isCategorical
//     ) {
//       const start = selectedRange[0];
//       const end = selectedRange[1] + 1; // +1 to include the end range in slice
//       dataToProcess = dataToProcess.slice(start, end);
//     }

//     // Filter only selected attributes from the potentially range-filtered data
//     const filteredAttributesData = dataToProcess.map((row) => {
//       const filteredRow: any = {};
//       selectedAttributes.forEach((attr) => {
//         filteredRow[attr] = row[attr];
//       });
//       return filteredRow;
//     });

//     // Downsample the result if necessary
//     const downsampleToSize = (data: any[], maxPoints: number): any[] => {
//       if (data.length <= maxPoints) {
//         return data; // No need to downsample if already within limits
//       }
//       const sampleRate = Math.ceil(data.length / maxPoints);
//       return data.filter((_, index) => index % sampleRate === 0);
//     };

//     return downsampleToSize(filteredAttributesData, 1000);
//   }, [
//     dataset.data, // Only for initial empty check
//     selectedAttributes,
//     selectedRange,
//     selectedChartType,
//     sortedDataAndIndices.sortedData, // Crucial: depend on the sorted data
//     isCategorical,
//   ]);

//   const getChartData = useCallback(
//     (chartType: ChartConfig["type"]) => {
//       if (!getFilteredData || getFilteredData.length === 0) return null;

//       switch (chartType) {
//         case "pie":
//           return generateCategoricalChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         case "scatter":
//           return generateScatterChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         case "radar":
//           return generateRadarChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         case "histogram":
//           return generateHistogramChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || []
//           );
//         default:
//           return generateLineBarChartData(
//             getFilteredData,
//             selectedAttributes,
//             chartConfig.colors || [],
//             chartType,
//             dataset.name
//           );
//       }
//     },
//     [getFilteredData, selectedAttributes, chartConfig.colors, dataset.name]
//   );

//   // ===== MEMOIZED VALUES =====
//   const chartData = useMemo(
//     () => getChartData(selectedChartType),
//     [getChartData, selectedChartType]
//   );

//   const compatibleChartTypes = useMemo(
//     () => getCompatibleChartTypes(dataset, selectedAttributes),
//     [dataset, selectedAttributes]
//   );

//   const rangeLabels = useMemo(() => {
//     if (!dataset.data || selectedAttributes.length === 0) return [];
//     const labelAttr = selectedAttributes[0];
//     // Range labels should directly reflect the sorted data
//     return sortedDataAndIndices.sortedData.map(
//       (item, index) => {
//           const value = item[labelAttr];
//           // If it's a date attribute, format the date for the label
//           const attrType = attributeTypes.find(a => a.name === labelAttr)?.type;
//           if (attrType === "date" && value) {
//               const date = new Date(value);
//               // You might want a more sophisticated date format here
//               return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//           }
//           return value || `Point ${index + 1}`;
//       }
//     );
//   }, [dataset.data, selectedAttributes, sortedDataAndIndices.sortedData, attributeTypes]); // Depend on sortedData directly

//   const currentChartType = chartTypes.find(
//     (ct) => ct.type === selectedChartType
//   );
//   const supportsRangeSelector =
//     currentChartType?.supportsRange &&
//     dataset.data &&
//     dataset.data.length > 1 &&
//     !isCategorical;

//   const chartOptions = useMemo(
//     () =>
//       getChartOptions(
//         selectedChartType,
//         selectedAttributes.length === 1,
//         selectedAttributes[0],
//         selectedAttributes.slice(1),
//         dataset.name,
//         chartConfig,
//         isFullscreen
//       ),
//     [
//       selectedChartType,
//       selectedAttributes,
//       dataset.name,
//       chartConfig,
//       isFullscreen,
//     ]
//   );

//   const handleRangeChange = useCallback(
//     (range: [number, number]) => {
//       setSelectedRange(range);
//     },
//     [setSelectedRange]
//   );

//   const throttledHandleRangeChange = useMemo(
//     () => throttle(handleRangeChange, 16),
//     [handleRangeChange]
//   );

//   return {
//     chartData,
//     compatibleChartTypes,
//     rangeLabels,
//     supportsRangeSelector,
//     chartOptions,
//     getChartData,
//     throttledHandleRangeChange,
//   };
// };


// Data processing and chart options hook
import { useMemo, useCallback } from "react";
import { ChartConfig, Dataset } from "../../types";
import { chartTypes } from "../constants/ChartConstants";

import {
  generateCategoricalChartData,
  generateScatterChartData,
  generateRadarChartData,
  generateHistogramChartData,
  generateLineBarChartData,
  getCompatibleChartTypes,
} from "../utils/chartDataUtils";
import { getChartOptions } from "../utils/chartOptions";
import { throttle } from "lodash";

export interface AttributeInfo {
  name: string;
  type: "number" | "string" | "date";
}

// Add this helper function outside of your useChartData hook
const parseDDMMYYYY = (dateString: string): Date => {
  if (!dateString) return new Date(NaN); // Handle empty/null strings
  const parts = dateString.split('/');
  // Note: Month is 0-indexed in Date constructor, so parts[1] - 1
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
};

export const useChartData = (
  dataset: Dataset,
  selectedChartType: ChartConfig["type"],
  selectedAttributes: string[],
  selectedRange: [number, number],
  setSelectedRange: (range: [number, number]) => void,
  chartConfig: ChartConfig,
  isFullscreen: boolean,
  attributeTypes: AttributeInfo[] // New parameter to receive attribute types
) => {
  // Determine if the first selected attribute is categorical
  const isCategorical = useMemo(() => {
    if (selectedAttributes.length === 0) return false;
    const attr = attributeTypes.find((a) => a.name === selectedAttributes[0]);
    return attr?.type === "string";
  }, [selectedAttributes, attributeTypes]);

  // Sort data based on the first selected attribute (only if not categorical)
  const sortedDataAndIndices = useMemo(() => {
    if (!dataset.data || selectedAttributes.length === 0) {
      return {
        sortedData: dataset.data,
        originalIndices: dataset.data?.map((_, i) => i) || [],
      };
    }

    const attr = selectedAttributes[0];
    const attrType =
      attributeTypes.find((a) => a.name === attr)?.type || "string";

    if (attrType === "string") {
      // For categorical attributes, return unsorted data
      return {
        sortedData: dataset.data,
        originalIndices: dataset.data.map((_, i) => i),
      };
    }

    const dataWithOriginalIndex = dataset.data.map((item, index) => ({
      item,
      originalIndex: index,
    }));

    dataWithOriginalIndex.sort((a, b) => {
      const valA = a.item[attr];
      const valB = b.item[attr];

      if (attrType === "date") {
        const dateA = parseDDMMYYYY(valA);
        const dateB = parseDDMMYYYY(valB);

        // Handle invalid dates by pushing them to the end (for ascending sort)
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1; // dateA is invalid, push to end
        if (isNaN(dateB.getTime())) return -1; // dateB is invalid, push to end

        return dateA.getTime() - dateB.getTime();
      }

      const numA = Number(valA);
      const numB = Number(valB);

      // Handle NaN for numerical comparison (e.g., push to end)
      if (isNaN(numA) && isNaN(numB)) return 0;
      if (isNaN(numA)) return 1; // numA is NaN, push to end
      if (isNaN(numB)) return -1; // numB is NaN, push to end

      return numA - numB;
    });

    const sortedData = dataWithOriginalIndex.map((entry) => entry.item);
    const originalIndices = dataWithOriginalIndex.map(
      (entry) => entry.originalIndex
    );

    if (attrType === "date") {
      console.log("Sorted data for dates (DD/MM/YYYY parsed):", sortedData);
      console.log("Original indices after date sort:", originalIndices);
    }

    return { sortedData, originalIndices };
  }, [dataset.data, selectedAttributes, attributeTypes]); // Dependencies for sortedDataAndIndices

  // Memoized function to get filtered data
  const getFilteredData = useMemo(() => {
    if (!dataset.data || selectedAttributes.length === 0) return []; // Return empty array if no data or attributes

    let dataToProcess = sortedDataAndIndices.sortedData;

    // Apply range filter *directly* to the already sorted data
    const currentChartType = chartTypes.find(
      (ct) => ct.type === selectedChartType
    );
    if (
      currentChartType?.supportsRange &&
      selectedRange[0] !== selectedRange[1] &&
      !isCategorical
    ) {
      const start = selectedRange[0];
      const end = selectedRange[1] + 1; // +1 to include the end range in slice
      dataToProcess = dataToProcess.slice(start, end);
    }

    // Filter only selected attributes from the potentially range-filtered data
    const filteredAttributesData = dataToProcess.map((row) => {
      const filteredRow: any = {};
      selectedAttributes.forEach((attr) => {
        filteredRow[attr] = row[attr];
      });
      return filteredRow;
    });

    // --- REMOVED DOWNSAMPLING LOGIC ---
    // The previous downsampleToSize function and its call are removed.
    // This means `filteredAttributesData` will be returned as is, without size limits.

    console.log("Filtered data sent to chart (NO DOWNSAMPLING):", filteredAttributesData);
    return filteredAttributesData; // Return the data without downsampling
  }, [
    dataset.data, // Only for initial empty check
    selectedAttributes,
    selectedRange,
    selectedChartType,
    sortedDataAndIndices.sortedData, // Crucial: depend on the sorted data
    isCategorical,
  ]);

  const getChartData = useCallback(
    (chartType: ChartConfig["type"]) => {
      if (!getFilteredData || getFilteredData.length === 0) return null;

      switch (chartType) {
        case "pie":
          return generateCategoricalChartData(
            getFilteredData,
            selectedAttributes,
            chartConfig.colors || []
          );
        case "scatter":
          return generateScatterChartData(
            getFilteredData,
            selectedAttributes,
            chartConfig.colors || []
          );
        case "radar":
          return generateRadarChartData(
            getFilteredData,
            selectedAttributes,
            chartConfig.colors || []
          );
        case "histogram":
          return generateHistogramChartData(
            getFilteredData,
            selectedAttributes,
            chartConfig.colors || []
          );
        default:
          return generateLineBarChartData(
            getFilteredData,
            selectedAttributes,
            chartConfig.colors || [],
            chartType,
            dataset.name
          );
      }
    },
    [getFilteredData, selectedAttributes, chartConfig.colors, dataset.name]
  );

  // ===== MEMOIZED VALUES =====
  const chartData = useMemo(
    () => getChartData(selectedChartType),
    [getChartData, selectedChartType]
  );

  const compatibleChartTypes = useMemo(
    () => getCompatibleChartTypes(dataset, selectedAttributes),
    [dataset, selectedAttributes]
  );

  const rangeLabels = useMemo(() => {
    if (!dataset.data || selectedAttributes.length === 0) return [];
    const labelAttr = selectedAttributes[0];
    // Range labels should directly reflect the sorted data
    return sortedDataAndIndices.sortedData.map(
      (item, index) => {
          const value = item[labelAttr];
          const attrType = attributeTypes.find(a => a.name === labelAttr)?.type;
          if (attrType === "date" && value) {
              const date = parseDDMMYYYY(value);
              if (isNaN(date.getTime())) return `Invalid Date: ${value}`;
              return date.toLocaleDateString('en-GB'); // 'en-GB' for dd/mm/yyyy format
          }
          return value || `Point ${index + 1}`;
      }
    );
  }, [dataset.data, selectedAttributes, sortedDataAndIndices.sortedData, attributeTypes]);

  const currentChartType = chartTypes.find(
    (ct) => ct.type === selectedChartType
  );
  const supportsRangeSelector =
    currentChartType?.supportsRange &&
    dataset.data &&
    dataset.data.length > 1 &&
    !isCategorical;

  const chartOptions = useMemo(
    () =>
      getChartOptions(
        selectedChartType,
        selectedAttributes.length === 1,
        selectedAttributes[0],
        selectedAttributes.slice(1),
        dataset.name,
        chartConfig,
        isFullscreen
      ),
    [
      selectedChartType,
      selectedAttributes,
      dataset.name,
      chartConfig,
      isFullscreen,
    ]
  );

  const handleRangeChange = useCallback(
    (range: [number, number]) => {
      setSelectedRange(range);
    },
    [setSelectedRange]
  );

  const throttledHandleRangeChange = useMemo(
    () => throttle(handleRangeChange, 16),
    [handleRangeChange]
  );

  return {
    chartData,
    compatibleChartTypes,
    rangeLabels,
    supportsRangeSelector,
    chartOptions,
    getChartData,
    throttledHandleRangeChange,
  };
};