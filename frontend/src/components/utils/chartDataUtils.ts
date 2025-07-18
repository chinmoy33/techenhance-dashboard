import { ChartConfig, Dataset } from "../../types";
import { chartTypes } from "../constants/ChartConstants";

/**
 * Analyzes the selected attributes and returns a count of numeric and categorical values
 * @returns An object with two properties: `numeric` and `categorical`
 */
export const analyzeSelectedAttributes = (
  dataset: Dataset,
  selectedAttributes: string[]
): { numeric: number; categorical: number } => {
  if (!dataset.data || selectedAttributes.length === 0) {
    // If no data or no selected attributes, return empty counts
    return { numeric: 0, categorical: 0 };
  }

  let numeric = 0;
  let categorical = 0;

  // Count numeric and categorical values for each selected attribute
  selectedAttributes.forEach((attr) => {
    const values = dataset.data
      .map((row) => row[attr])
      .filter((val) => val !== null && val !== undefined && val !== "");
    const numericValues = values.filter(
      (val) => !isNaN(Number(val)) && val !== ""
    );

    // If more than 50% of values are numeric, count as numeric
    if (numericValues.length > values.length * 0.5) {
      numeric++;
    } else {
      categorical++;
    }
  });

  return { numeric, categorical };
};

/**
 * Determines which chart types are compatible with current selection
 * @returns Array of compatible chart type objects
 */
export const getCompatibleChartTypes = (
  dataset: Dataset,
  selectedAttributes: string[]
) => {
  const { numeric, categorical } = analyzeSelectedAttributes(
    dataset,
    selectedAttributes
  );
  const total = selectedAttributes.length;

  if (categorical === total && total > 0 && total < 2) {
    return chartTypes.filter((chartType) => ["pie"].includes(chartType.type));
  }

  // Generate compatibility key based on selection
  let compatibilityKey = "";
  if (total === 1) {
    compatibilityKey = numeric === 1 ? "1-numeric" : "1-categorical";
  } else if (total === 2) {
    if (numeric === 2) compatibilityKey = "2-numeric";
    else if (numeric === 1 && categorical === 1)
      compatibilityKey = "1-numeric-1-categorical";
  } else if (total === 3) {
    if (numeric === 3) compatibilityKey = "3-numeric";
  }

  // Filter chart types based on compatibilitykey
  return chartTypes.filter((chartType) =>
    chartType.compatibility.includes(compatibilityKey)
  );
};

/**
 * Generates data for pie, doughnut, and polar area charts
 */
export const generateCategoricalChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  colors: string[]
) => {
  const categoricalAttr = selectedAttributes.find((attr) => {
    const values = filteredData.map((row) => row[attr]);
    const numericValues = values.filter(
      (val) => !isNaN(Number(val)) && val !== ""
    );
    return numericValues.length < values.length * 0.5;
  });

  if (!categoricalAttr) return null;

  // Step 1: Frequency Map
  const freqMap = new Map<string, number>();

  filteredData.forEach((item) => {
    const key = item[categoricalAttr] ?? "Unknown";
    freqMap.set(key, (freqMap.get(key) || 0) + 1);
  });

  // Step 2: Extract labels and values
  const labels = Array.from(freqMap.keys());
  const values = Array.from(freqMap.values());

  return {
    labels,
    datasets: [
      {
        label: filteredData.name,
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors
          .slice(0, labels.length)
          .map((color) => color.replace("0.8", "1")),
        borderWidth: 2,
      },
    ],
  };
};

/**
 * Generates data for scatter and bubble charts
 */
export const generateScatterChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  colors: string[]
) => {
  if (selectedAttributes.length < 2) return null;

  const xAttr = selectedAttributes[0];
  const yAttr = selectedAttributes[1];

  // const sizeAttr = selectedAttributes[2]; // For bubble charts
  const scatterData = filteredData.map((item) => ({
    x: Number(item[xAttr]) || 0,
    y: Number(item[yAttr]) || 0,
  }));

  return {
    datasets: [
      {
        label: `${xAttr} vs ${yAttr}`,
        data: scatterData,
        backgroundColor: colors[0],
        borderColor: colors[0]?.replace("0.8", "1"),
      },
    ],
  };
};

/**
 * Generates data for radar charts
 */
export const generateRadarChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  colors: string[]
) => {
  if (selectedAttributes.length === 0) return null;

  const labels = selectedAttributes.map(
    (attr) => attr.charAt(0).toUpperCase() + attr.slice(1)
  );
  const avgValues = selectedAttributes.map((attr) => {
    const values = filteredData.map((item) => Number(item[attr]) || 0);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  });

  const maxValue = Math.max(...avgValues);
  const percentages = avgValues.map((val) =>
    ((val / maxValue) * 100).toFixed(1)
  );

  return {
    labels: labels.map((label, index) => `${label}\n(${percentages[index]}%)`),
    datasets: [
      {
        label: filteredData.name,
        data: avgValues,
        backgroundColor: colors[0],
        borderColor: colors[0]?.replace("0.8", "1"),
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: colors[0]?.replace("0.8", "1"),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colors[0]?.replace("0.8", "1"),
      },
    ],
  };
};

/**
 * Generates data for histogram charts (frequency distribution)
 * Creates bins and counts frequency of values in each bin
 * Uses custom bar chart implementation since Chart.js doesn't have native histogram
 */
export const generateHistogramChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  colors: string[]
) => {
  if (selectedAttributes.length === 0) return null;

  // Use first numeric attribute for histogram
  const numericAttr = selectedAttributes.find((attr) => {
    const values = filteredData.map((row) => row[attr]);
    const numericValues = values.filter(
      (val) => !isNaN(Number(val)) && val !== ""
    );
    return numericValues.length > values.length * 0.5;
  });

  if (!numericAttr) return null;

  // Extract numeric values and filter out non-numeric data
  const values = filteredData
    .map((item) => Number(item[numericAttr]))
    .filter((val) => !isNaN(val))
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  // Calculate optimal number of bins using Sturges' rule
  const numBins = Math.max(5, Math.ceil(Math.log2(values.length) + 1));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / numBins;

  // Create bins and count frequencies
  const bins: { label: string; count: number; range: [number, number] }[] = [];

  for (let i = 0; i < numBins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = i === numBins - 1 ? max : binStart + binWidth;

    // Count values in this bin (inclusive start, exclusive end, except for last bin)
    const count = values.filter(
      (val) =>
        val >= binStart && (i === numBins - 1 ? val <= binEnd : val < binEnd)
    ).length;

    bins.push({
      label: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
      count,
      range: [binStart, binEnd],
    });
  }

  // Return Chart.js bar chart data structure for histogram
  return {
    labels: bins.map((bin) => bin.label),
    datasets: [
      {
        label: `Frequency of ${numericAttr}`,
        data: bins.map((bin) => bin.count),
        backgroundColor: colors[0] || "rgba(59, 130, 246, 0.8)",
        borderColor: colors[0]?.replace("0.8", "1") || "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 2,
        borderSkipped: false,
        // Custom histogram styling
        barPercentage: 1.0, // Full width bars for histogram
        categoryPercentage: 1.0, // No gaps between bars
      },
    ],
  };
};

/**
 * Generates data for line and bar charts
 */
export const generateLineBarChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  colors: string[],
  chartType: ChartConfig["type"],
  datasetName: string
) => {
  if (selectedAttributes.length === 0) return null;

  // Use first attribute for labels (x-axis)
  const labelAttr = selectedAttributes[0];
  const labels = filteredData.map(
    (item, index) => item[labelAttr] || `Point ${index + 1}`
  );

  const datasets = [];
  // Skip first attribute used for labels
  const dataAttributes = selectedAttributes.slice(1);

  if (dataAttributes.length === 0) {
    // If only one attribute selected, use it for both labels and data
    dataAttributes.push(labelAttr);
  }

  dataAttributes.forEach((attr, index) => {
    const values = filteredData.map((item) => Number(item[attr]) || 0);
    datasets.push({
      label: attr.charAt(0).toUpperCase() + attr.slice(1),
      data: values,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length]?.replace("0.8", "1"),
      borderWidth: 2,
      fill: chartType === "line" ? false : true,
      tension: 0.4,
    });
  });

  return { labels, datasets };
};
