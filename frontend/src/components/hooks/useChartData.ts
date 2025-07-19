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

  // Sort data based on the first selected attribute
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

    // For numerical or date attributes, sort in ascending order
    const sortedData = [...dataset.data];
    const originalIndices = dataset.data.map((_, i) => i);

    sortedData.sort((a, b) => {
      const valA = a[attr];
      const valB = b[attr];

      if (attrType === "date") {
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        return dateA.getTime() - dateB.getTime();
      }

      const numA = Number(valA);
      const numB = Number(valB);
      return numA - numB;
    });

    // Update originalIndices to reflect sorted order
    const sortedIndices = sortedData.map((item, index) => {
      return dataset.data.findIndex(
        (d, i) => d === item && originalIndices[i] !== undefined
      );
    });

    return { sortedData, originalIndices: sortedIndices };
  }, [dataset.data, selectedAttributes, attributeTypes]);

  const getFilteredData = useMemo(() => {
    if (!dataset.data || selectedAttributes.length === 0) return dataset.data;

    // Filter only selected attributes
    const baseData = sortedDataAndIndices.sortedData.map((row) => {
      const filteredRow: any = {};
      selectedAttributes.forEach((attr) => {
        filteredRow[attr] = row[attr];
      });
      return filteredRow;
    });

    // Apply range filter for supported chart types
    const currentChartType = chartTypes.find(
      (ct) => ct.type === selectedChartType
    );
    if (
      currentChartType?.supportsRange &&
      selectedRange[0] !== selectedRange[1] &&
      !isCategorical
    ) {
      const selectedIndices = sortedDataAndIndices.originalIndices.slice(
        selectedRange[0],
        selectedRange[1] + 1
      );
      return selectedIndices
        .map((index) => dataset.data[index])
        .map((row) => {
          const filteredRow: any = {};
          selectedAttributes.forEach((attr) => {
            filteredRow[attr] = row[attr];
          });
          return filteredRow;
        });
    }

    // Downsample the filtered result to a max of 1000 rows
    const downsampleToSize = (data: any[], maxPoints: number): any[] => {
      const sampleRate = Math.ceil(data.length / maxPoints);
      return data.filter((_, index) => index % sampleRate === 0);
    };
    if (baseData.length > 1000) {
      return downsampleToSize(baseData, 1000);
    } else {
      return baseData;
    }
  }, [
    dataset.data,
    selectedAttributes,
    selectedRange,
    selectedChartType,
    sortedDataAndIndices,
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
    return sortedDataAndIndices.sortedData.map(
      (item, index) => item[labelAttr] || `Point ${index + 1}`
    );
  }, [dataset.data, selectedAttributes, sortedDataAndIndices]);

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
      setSelectedRange(range); // Now uses the passed setSelectedRange
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
    getFilteredData,
  };
};
