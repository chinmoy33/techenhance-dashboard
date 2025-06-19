// ===== DATA PROCESSING FUNCTIONS =====

import { ChartConfig, Dataset } from "../../types";

/**
 * Filters dataset to only include selected attributes
 * @returns Filtered data array with only selected columns
 */

export const getFilteredData = (
  dataset: Dataset,
  selectedAttributes: string[]
) => {
  if (!dataset.data || selectedAttributes.length === 0) return dataset.data;

  return dataset.data.map((row) => {
    const filteredRow: any = {};
    selectedAttributes.forEach((attr) => {
      filteredRow[attr] = row[attr];
    });
    return filteredRow;
  });
};

/**
 * Generates chart data based on chart type and selected attributes
 * @param chartType - Type of chart to generate data for
 * @returns Chart.js compatible data object
 */
export const getChartData = (
  chartType: ChartConfig["type"],
  dataset: Dataset,
  selectedAttributes: string[],
  chartConfig: ChartConfig
) => {
  const filteredData = getFilteredData(dataset, selectedAttributes);
  if (!filteredData || filteredData.length === 0) return null;

  // Handle pie/doughnut/polar area charts (categorical data)
  if (
    chartType === "pie" ||
    chartType === "doughnut" ||
    chartType === "polarArea"
  ) {
    return generateCategoricalChartData(
      filteredData,
      dataset,
      selectedAttributes,
      chartConfig
    );
  }

  // Handle scatter/bubble charts (correlation data)
  if (chartType === "scatter" || chartType === "bubble") {
    return generateScatterChartData(
      filteredData,
      chartType,
      selectedAttributes,
      chartConfig
    );
  }

  // Handle radar charts (multi-dimensional data)
  if (chartType === "radar") {
    return generateRadarChartData(
      filteredData,
      selectedAttributes,
      chartConfig
    );
  }

  // Handle line/bar charts (time series or categorical comparison)
  return generateLineBarChartData(
    filteredData,
    selectedAttributes,
    chartConfig,
    chartType
  );
};

/**
 * Generates data for pie, doughnut, and polar area charts
 */
const generateCategoricalChartData = (
  filteredData: any[],
  dataset: Dataset,
  selectedAttributes: string[],
  chartConfig: ChartConfig
) => {
  // Find first categorical attribute for labels and first numeric for values
  const categoricalAttr = selectedAttributes.find((attr) => {
    const values = dataset.data.map((row) => row[attr]);
    const numericValues = values.filter(
      (val) => !isNaN(Number(val)) && val !== ""
    );
    return numericValues.length < values.length * 0.5; // Less than 50% numeric = categorical
  });

  const numericAttr = selectedAttributes.find((attr) => {
    const values = dataset.data.map((row) => row[attr]);
    const numericValues = values.filter(
      (val) => !isNaN(Number(val)) && val !== ""
    );
    return numericValues.length > values.length * 0.5; // More than 50% numeric
  });

  if (!categoricalAttr && !numericAttr) return null;

  const labels = filteredData.map(
    (item, index) =>
      item[categoricalAttr || selectedAttributes[0]] || `Item ${index + 1}`
  );
  const values = filteredData.map(
    (item) => Number(item[numericAttr || selectedAttributes[0]]) || 1
  );

  return {
    labels,
    datasets: [
      {
        label: dataset.name,
        data: values,
        backgroundColor: chartConfig.colors,
        borderColor: chartConfig.colors?.map((color) =>
          color.replace("0.8", "1")
        ),
        borderWidth: 2,
      },
    ],
  };
};

/**
 * Generates data for scatter and bubble charts
 */
const generateScatterChartData = (
  filteredData: any[],
  chartType: "scatter" | "bubble",
  selectedAttributes: string[],
  chartConfig: ChartConfig
) => {
  if (selectedAttributes.length < 2) return null;

  const xAttr = selectedAttributes[0];
  const yAttr = selectedAttributes[1];
  const sizeAttr = selectedAttributes[2]; // For bubble charts

  const scatterData = filteredData.map((item) => ({
    x: Number(item[xAttr]) || 0,
    y: Number(item[yAttr]) || 0,
    r:
      chartType === "bubble" && sizeAttr
        ? Number(item[sizeAttr]) || 5
        : undefined,
  }));

  return {
    datasets: [
      {
        label: `${xAttr} vs ${yAttr}`,
        data: scatterData,
        backgroundColor: chartConfig.colors?.[0],
        borderColor: chartConfig.colors?.[0]?.replace("0.8", "1"),
        pointRadius: chartType === "bubble" ? undefined : 6,
        pointHoverRadius: chartType === "bubble" ? undefined : 8,
      },
    ],
  };
};

/**
 * Generates data for radar charts
 */
const generateRadarChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  chartConfig: ChartConfig
) => {
  if (selectedAttributes.length === 0) return null;

  const labels = selectedAttributes.map(
    (attr) => attr.charAt(0).toUpperCase() + attr.slice(1)
  );
  const avgValues = selectedAttributes.map((attr) => {
    const values = filteredData.map((item) => Number(item[attr]) || 0);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  });

  return {
    labels,
    datasets: [
      {
        label: chartConfig.title || "Dataset",
        data: avgValues,
        backgroundColor: chartConfig.colors?.[0],
        borderColor: chartConfig.colors?.[0]?.replace("0.8", "1"),
        borderWidth: 2,
        fill: true,
      },
    ],
  };
};

/**
 * Generates data for line and bar charts
 */
const generateLineBarChartData = (
  filteredData: any[],
  selectedAttributes: string[],
  chartConfig: ChartConfig,
  chartType: ChartConfig["type"]
) => {
  if (selectedAttributes.length === 0) return null;

  // Use first attribute for labels (x-axis)
  const labelAttr = selectedAttributes[0];
  const labels = filteredData.map(
    (item, index) => item[labelAttr] || `Point ${index + 1}`
  );

  const datasets = [];
  const dataAttributes = selectedAttributes.slice(1); // Skip first attribute used for labels

  if (dataAttributes.length === 0) {
    // If only one attribute selected, use it for both labels and data
    dataAttributes.push(labelAttr);
  }

  dataAttributes.forEach((attr, index) => {
    const values = filteredData.map((item) => Number(item[attr]) || 0);

    datasets.push({
      label: attr.charAt(0).toUpperCase() + attr.slice(1),
      data: values,
      backgroundColor: chartConfig.colors?.[index % chartConfig.colors.length],
      borderColor: chartConfig.colors?.[
        index % chartConfig.colors.length
      ]?.replace("0.8", "1"),
      borderWidth: 2,
      fill: chartType === "line" ? false : true,
      tension: 0.4,
    });
  });

  return { labels, datasets };
};
