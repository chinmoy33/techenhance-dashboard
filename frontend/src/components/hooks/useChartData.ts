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

export const useChartData = (
  dataset: Dataset,
  selectedChartType: ChartConfig["type"],
  selectedAttributes: string[],
  selectedRange: [number, number],
  setSelectedRange: (range: [number, number]) => void,
  chartConfig: ChartConfig,
  isFullscreen: boolean
) => {
  const getFilteredData = useMemo(() => {
    if (!dataset.data || selectedAttributes.length === 0) return dataset.data;

    // Filter only selected attributes
    const baseData = dataset.data.map((row) => {
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
      selectedRange[0] !== selectedRange[1]
    ) {
      return baseData.slice(selectedRange[0], selectedRange[1] + 1);
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
  }, [dataset.data, selectedAttributes, selectedRange, selectedChartType]);

  const getChartData = useCallback(
    (chartType: ChartConfig["type"]) => {
      if (!getFilteredData || getFilteredData.length === 0) return null;

      switch (chartType) {
        case "pie":
        case "polarArea":
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
    return dataset.data.map(
      (item, index) => item[labelAttr] || `Point ${index + 1}`
    );
  }, [dataset.data, selectedAttributes]);

  const currentChartType = chartTypes.find(
    (ct) => ct.type === selectedChartType
  );
  const supportsRangeSelector =
    currentChartType?.supportsRange && dataset.data && dataset.data.length > 1;

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
  };
};
