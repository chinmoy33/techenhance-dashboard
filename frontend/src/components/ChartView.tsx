import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import {
  Line,
  Bar,
  Pie,
  // Doughnut,
  Scatter,
  Radar,
  PolarArea,
  // Bubble,
} from "react-chartjs-2";
import {
  Settings,
  Download,
  Maximize2,
  // BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  // Target,
  // Zap,
  // Activity,
  // TrendingUp,
  Grid3X3,
  X,
  Palette,
  RotateCcw,
  Filter,
  RotateCw,
} from "lucide-react";
import { Dataset, ChartConfig } from "../types";
import AttributeSelector from "./chartModules/AttributeSelector";
import { chartTypes, colorThemes } from "./chartModules/ChartConstants";
import toast from "react-hot-toast";
import zoomPlugin from "chartjs-plugin-zoom";
import AllChartsView from "../components/chartModules/AllChartsViews";

// Register Chart.js components for all chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
  zoomPlugin // Add zoom plugin
);

interface ChartViewProps {
  dataset: Dataset;
  initialChartType?: ChartConfig["type"];
  showAllCharts?: boolean;
  onChartSelect?: (chartType: ChartConfig["type"]) => void;
}

const ChartView: React.FC<ChartViewProps> = ({
  dataset,
  initialChartType = "line",
  showAllCharts = false,
  onChartSelect,
}) => {
  // ===== STATE MANAGEMENT =====
  const [selectedChartType, setSelectedChartType] =
    useState<ChartConfig["type"]>(initialChartType);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAttributeSelector, setShowAttributeSelector] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [isSingleSelectedAttribute, setIsSingleSelectedAttribute] =
    useState<boolean>(false);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: initialChartType,
    title: `${dataset.name} Visualization`,
    colors: [
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(139, 92, 246, 0.8)", // Purple
      "rgba(16, 185, 129, 0.8)", // Green
      "rgba(245, 158, 11, 0.8)", // Yellow
      "rgba(239, 68, 68, 0.8)", // Red
      "rgba(236, 72, 153, 0.8)", // Pink
      "rgba(14, 165, 233, 0.8)", // Sky
      "rgba(168, 85, 247, 0.8)", // Violet
    ],
  });

  // ===== REFS =====
  const chartRef = useRef<any>(null);

  // ===== AUTO-INITIALIZATION EFFECT =====
  // Initialize selected attributes when dataset changes

  React.useEffect(() => {
    if (
      dataset.data &&
      dataset.data.length > 0 &&
      selectedAttributes.length === 0
    ) {
      const firstRow = dataset.data[0];

      // Find numeric columns by checking if values can be converted to numbers
      const numericColumns = Object.keys(firstRow).filter((key) => {
        if (key === "CHQ.NO") return false; // Skip this column


        const values = dataset.data
          .map((row) => row[key])
          .filter((val) => val !== null && val !== undefined && val !== "");
        const numericValues = values.filter(
          (val) => !isNaN(Number(val)) && val !== ""
        );
        return numericValues.length > values.length * 0.5; // At least 50% numeric
      });

      // Auto-select first 2 numeric columns or all if less than 2
      const autoSelected = numericColumns.slice(
        0,
        Math.min(2, numericColumns.length)
      );
      if (autoSelected.length === 0) {
        // If no numeric columns, select first columns
        setSelectedAttributes(Object.keys(firstRow).slice(0, 1));
      } else {
        setSelectedAttributes(autoSelected);
      }
    }
  }, [dataset.data]);

  const analyzeSelectedAttributes = () => {
    if (!dataset.data || selectedAttributes.length === 0) {
      return { numeric: 0, categorical: 0 };
    }

    let numeric = 0;
    let categorical = 0;

    selectedAttributes.forEach((attr) => {
      const values = dataset.data
        .map((row) => row[attr])
        .filter((val) => val !== null && val !== undefined && val !== "");
      const numericValues = values.filter(
        (val) => !isNaN(Number(val)) && val !== ""
      );

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
  const getCompatibleChartTypes = () => {
    const { numeric, categorical } = analyzeSelectedAttributes();
    const total = selectedAttributes.length;

    if (categorical === total && total > 0 && total <2) {
    return chartTypes.filter((chartType) =>
      ["pie", "polarArea"].includes(chartType.type)
    );
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

    // Filter chart types based on compatibility
    return chartTypes.filter((chartType) =>
      chartType.compatibility.includes(compatibilityKey)
    );
  };


  const compatibleChartTypes = useMemo(
    () => getCompatibleChartTypes(),
    [selectedAttributes, dataset.data]
  );


  React.useEffect(() => {
  if (compatibleChartTypes.length > 0) {
    setSelectedChartType(compatibleChartTypes[0].type);
  }
}, [compatibleChartTypes]);

  // ===== ATTRIBUTE ANALYSIS FUNCTIONS =====

  /**
   * Analyzes selected attributes to determine their types
   * @returns Object containing counts of numeric and categorical attributes
   */
  

  // ===== DATA PROCESSING FUNCTIONS =====

  /**
   * Generates data for pie, doughnut, and polar area charts
   */
  const generateCategoricalChartData = (filteredData: any[]) => {
    const categoricalAttr = selectedAttributes.find((attr) => {
      const values = dataset.data.map((row) => row[attr]);
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
          label: dataset.name,
          data: values,
          backgroundColor: chartConfig.colors?.slice(0, labels.length),
          borderColor: chartConfig.colors
            ?.slice(0, labels.length)
            .map((color) => color.replace("0.8", "1")),
          borderWidth: 2,
        },
      ],
    };
  };

  /**
   * Generates data for scatter and bubble charts
   */
  function generateScatterChartData(
    filteredData: any[],
    chartType: "scatter" //| "bubble"
  ) {
    if (selectedAttributes.length < 2) return null;

    const xAttr = selectedAttributes[0];
    const yAttr = selectedAttributes[1];
    // const sizeAttr = selectedAttributes[2]; // For bubble charts
    const scatterData = filteredData.map((item) => ({
      x: Number(item[xAttr]) || 0,
      y: Number(item[yAttr]) || 0,
      // r:
      // chartType === "bubble" && sizeAttr
      //   ? Number(item[sizeAttr]) || 5
      //   : undefined,
    }));

    return {
      datasets: [
        {
          label: `${xAttr} vs ${yAttr}`,
          data: scatterData,
          backgroundColor: chartConfig.colors?.[0],
          borderColor: chartConfig.colors?.[0]?.replace("0.8", "1"),
          // pointRadius: chartType === "bubble" ? undefined : 6,
          // pointHoverRadius: chartType === "bubble" ? undefined : 8,
        },
      ],
    };
  }

  /**
   * Generates data for radar charts
   */
  const generateRadarChartData = (filteredData: any[]) => {
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
          label: dataset.name,
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
   * Generates data for histogram charts (frequency distribution)
   * Creates bins and counts frequency of values in each bin
   * Uses custom bar chart implementation since Chart.js doesn't have native histogram
   */
  const generateHistogramChartData = (filteredData: any[]) => {
    if (selectedAttributes.length === 0) return null;

    // Use first numeric attribute for histogram
    const numericAttr = selectedAttributes.find((attr) => {
      const values = dataset.data.map((row) => row[attr]);
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
    const bins: { label: string; count: number; range: [number, number] }[] =
      [];

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
          backgroundColor: chartConfig.colors?.[0] || "rgba(59, 130, 246, 0.8)",
          borderColor:
            chartConfig.colors?.[0]?.replace("0.8", "1") ||
            "rgba(59, 130, 246, 1)",
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
  const generateLineBarChartData = (filteredData: any[]) => {
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
        backgroundColor:
          chartConfig.colors?.[index % chartConfig.colors.length],
        borderColor: chartConfig.colors?.[
          index % chartConfig.colors.length
        ]?.replace("0.8", "1"),
        borderWidth: 2,
        fill: selectedChartType === "line" ? false : true,
        tension: 0.4,
      });
    });

    return { labels, datasets };
  };

  const getFilteredData = useMemo(() => {
    if (!dataset.data || selectedAttributes.length === 0) return dataset.data;

    // Filter only selected attributes
    const filtered = dataset.data.map((row) => {
      const filteredRow: any = {};
      selectedAttributes.forEach((attr) => {
        filteredRow[attr] = row[attr];
      });
      return filteredRow;
    });

    // Downsample the filtered result to a max of 1000 rows
    const downsampleToSize = (data: any[], maxPoints: number): any[] => {
      const sampleRate = Math.ceil(data.length / maxPoints);
      return data.filter((_, index) => index % sampleRate === 0);
    };
    if (filtered.length > 1000) {
      return downsampleToSize(filtered, 1000); // Downsample here
    } else {
      return filtered;
    }
  }, [dataset.data, selectedAttributes]);

  const getChartData = useCallback(
    (chartType: ChartConfig["type"]) => {
      if (!getFilteredData || getFilteredData.length === 0) return null;

      switch (chartType) {
        // case "doughnut":
        case "pie":
        case "polarArea":
          return generateCategoricalChartData(getFilteredData);

        case "scatter":
          // case "bubble":
          return generateScatterChartData(getFilteredData, chartType);

        case "radar":
          return generateRadarChartData(getFilteredData);

        case "histogram":
          return generateHistogramChartData(getFilteredData);

        default:
          return generateLineBarChartData(getFilteredData);
      }
    },
    [getFilteredData, selectedAttributes, chartConfig.colors]
  );

  // ===== CHART CONFIGURATION =====

  /**
   * Generates Chart.js options based on chart type
   */
  const getChartOptions = (
    chartType: ChartConfig["type"],
    isSingleSelectedAttribute: boolean,
    xLabel?: string,
    yLabel?: string[]
  ) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text:
          chartConfig.title ||
          `${dataset.name} - ${
            chartTypes.find((ct) => ct.type === chartType)?.label
          }`,
        color: "rgba(255, 255, 255, 0.9)",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        // Custom tooltip for histogram
        callbacks:
          chartType === "histogram"
            ? {
                title: function (context: any) {
                  return `Range: ${context[0].label}`;
                },
                label: function (context: any) {
                  return `Frequency: ${context.parsed.y}`;
                },
              }
            : undefined,
      },
      // Add zoom plugin configuration
      zoom: !["pie", "radar", "polarArea"].includes(chartType)
        ? {
            limits: {
              x: { min: "original", max: "original" },
              y: { min: "original", max: "original" },
            },
            pan: {
              enabled: true,
              mode: "xy" as const,
              modifierKey: "ctrl" as const,
            },
            zoom: {
              wheel: {
                enabled: true,
                modifierKey: "ctrl" as const,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy" as const,
            },
          }
        : undefined,
    },

    scales: !["pie", "radar", "polarArea"].includes(chartType)
      ? {
          x: {
            display: !(
              isSingleSelectedAttribute &&
              (chartType === "line" || chartType === "bar")
            ),
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            title: {
              display: !!xLabel || chartType === "histogram",
              text: chartType === "histogram" ? "Value Range" : xLabel || "",
              color: "rgba(255, 255, 255, 0.8)",
            },
            ...(chartType === "histogram" && {
              offset: false,
              grid: {
                offset: false,
                color: "rgba(255, 255, 255, 0.1)",
              },
            }),
          },

          y: {
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            title: {
              display: !!yLabel || chartType === "histogram",
              text: chartType === "histogram" ? "Frequency" : yLabel || "",
              color: "rgba(255, 255, 255, 0.8)",
            },
            beginAtZero: chartType === "histogram",
          },
        }
      : chartType === "radar"
      ? {
          r: {
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.2)" },
            pointLabels: { color: "rgba(255, 255, 255, 0.8)" },
          },
        }
      : {},

    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  });

  /**
   * Renders the appropriate chart component based on type
   */
  const renderChart = (chartType: ChartConfig["type"], data: any) => {
    if (!data) return null;

    const commonProps = {
      ref: chartRef,
      data,
      options: getChartOptions(
        chartType,
        selectedAttributes.length === 1,
        selectedAttributes[0],
        selectedAttributes.slice(1)
      ),
      className: "chart-container",
    };

    // Return appropriate chart component
    switch (chartType) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "histogram":
        return <Bar {...commonProps} />; // Histogram uses Bar chart with special data processing
      case "pie":
        return <Pie {...commonProps} />;
      // case "doughnut":
      //   return <Doughnut {...commonProps} />;
      case "scatter":
        return <Scatter {...commonProps} />;
      case "radar":
        return <Radar {...commonProps} />;
      case "polarArea":
        return <PolarArea {...commonProps} />;
      // case "bubble":
      //   return <Bubble {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  // ===== EVENT HANDLERS =====

  /**
   * Handles chart type selection
   */
  const handleChartTypeChange = (chartType: ChartConfig["type"]) => {
    const compatibleTypes = getCompatibleChartTypes();
    const isCompatible = compatibleTypes.some((ct) => ct.type === chartType);

    if (!isCompatible) {
      toast.error(
        `${
          chartTypes.find((ct) => ct.type === chartType)?.label
        } is not compatible with current selection`
      );
      return;
    }

    setSelectedChartType(chartType);
    if (onChartSelect) {
      onChartSelect(chartType);
    }
  };

  /**
   * Toggles fullscreen mode
   */
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  /**
   * Resets chart zoom to original view
   */
  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      toast.success("Chart zoom reset");
    }
  };

  /**
   * Exports chart as image
   */
  const exportChart = (format: "png" | "jpg" | "svg" | "pdf") => {
    if (!chartRef.current) {
      toast.error("Chart not available for export");
      return;
    }

    try {
      const canvas = chartRef.current.canvas;
      const link = document.createElement("a");

      if (format === "png" || format === "jpg") {
        const url = canvas.toDataURL(`image/${format}`, 1.0);
        link.href = url;
        link.download = `${dataset.name}-${selectedChartType}.${format}`;
      } else if (format === "svg") {
        // For SVG, we'll export as PNG since Chart.js doesn't natively support SVG
        const url = canvas.toDataURL("image/png", 1.0);
        link.href = url;
        link.download = `${dataset.name}-${selectedChartType}.png`;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Chart exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export chart");
      console.error("Export error:", error);
    }
  };

  /**
   * Exports filtered data
   */
  const exportData = (format: "csv" | "json") => {
    try {
      //const filteredData = getFilteredData();
      const filteredData = getFilteredData;
      let content = "";
      let mimeType = "";
      let extension = "";

      if (format === "csv") {
        const headers =
          selectedAttributes.length > 0
            ? selectedAttributes
            : Object.keys(dataset.data[0] || {});
        const csvContent = [
          headers.join(","),
          ...filteredData.map((row) =>
            headers
              .map((header) =>
                typeof row[header] === "string" && row[header].includes(",")
                  ? `"${row[header]}"`
                  : row[header]
              )
              .join(",")
          ),
        ].join("\n");

        content = csvContent;
        mimeType = "text/csv";
        extension = "csv";
      } else {
        content = JSON.stringify(filteredData, null, 2);
        mimeType = "application/json";
        extension = "json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataset.name}-filtered-data.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Filtered data exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    }
  };

  /**
   * Updates chart configuration
   */
  const updateChartConfig = (updates: Partial<ChartConfig>) => {
    setChartConfig((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Resets settings to default
   */
  const resetSettings = () => {
    setChartConfig({
      type: selectedChartType,
      title: `${dataset.name} Visualization`,
      colors: colorThemes[0].colors,
    });
    toast.success("Settings reset to default");
  };

  // ===== MEMOIZED VALUES =====
  const chartData = useMemo(
    () => getChartData(selectedChartType),
    [dataset.data, selectedChartType, selectedAttributes, chartConfig.colors]
  );

  
  // ===== RENDER LOGIC =====

  // Render All Charts View (grid of all chart types)

  if (showAllCharts) {
    return (
      <AllChartsView
        dataset={dataset}
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        showAttributeSelector={showAttributeSelector}
        setShowAttributeSelector={setShowAttributeSelector}
        compatibleChartTypes={compatibleChartTypes}
        getChartData={getChartData}
        renderChart={renderChart}
        onChartSelect={onChartSelect}
      />
    );
  }

  // Render Single Chart View
  return (
    <div
      className={`space-y-6 animate-fade-in ${
        isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto" : ""
      }`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{dataset.name}</h1>
          <p className="text-gray-400">
            {dataset.dataPoints || dataset.data?.length || 0} data points •{" "}
            {selectedAttributes.length} attributes selected
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAttributeSelector(!showAttributeSelector)}
            className={`glass-button px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showAttributeSelector
                ? "bg-primary-500/20 border-primary-500/50"
                : ""
            }`}
          >
            <Filter size={16} />
            <span>Attributes</span>
          </button>
          {/* Add Reset Zoom Button */}
          <button
            onClick={resetZoom}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            title="Reset Zoom (Ctrl+Wheel to zoom)"
          >
            <RotateCw size={16} />
            <span>Reset Zoom</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            {showExport && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-card p-3 rounded-lg z-10">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white mb-2">
                    Export Chart
                  </p>
                  <button
                    onClick={() => exportChart("png")}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm text-gray-300"
                  >
                    PNG Image
                  </button>
                  <button
                    onClick={() => exportChart("jpg")}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm text-gray-300"
                  >
                    JPG Image
                  </button>
                  <hr className="border-white/10 my-2" />
                  <p className="text-sm font-medium text-white mb-2">
                    Export Data
                  </p>
                  <button
                    onClick={() => exportData("csv")}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm text-gray-300"
                  >
                    Filtered CSV
                  </button>
                  <button
                    onClick={() => exportData("json")}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm text-gray-300"
                  >
                    Filtered JSON
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleFullscreen}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            {isFullscreen ? <X size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            {/* Settings Panel */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-card p-4 rounded-lg z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white">
                    Chart Settings
                  </h3>
                  <button
                    onClick={resetSettings}
                    className="glass-button px-2 py-1 rounded flex items-center space-x-1 text-xs"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Chart Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      value={chartConfig.title}
                      onChange={(e) =>
                        updateChartConfig({ title: e.target.value })
                      }
                      className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400 text-sm"
                      placeholder="Enter chart title"
                    />
                  </div>

                  {/* Color Theme Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() =>
                            updateChartConfig({ colors: theme.colors })
                          }
                          className={`p-2 rounded-lg border transition-all text-left ${
                            JSON.stringify(chartConfig.colors) ===
                            JSON.stringify(theme.colors)
                              ? "border-primary-400 bg-primary-500/20"
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <Palette size={12} className="text-gray-400" />
                            <span className="text-xs text-white">
                              {theme.name}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {theme.colors.slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attribute Selector */}
      {showAttributeSelector && (
        <AttributeSelector
          dataset={dataset}
          selectedAttributes={selectedAttributes}
          onAttributeChange={setSelectedAttributes}
        />
      )}

      {/* Chart Type Selector - Only show compatible types */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Compatible Chart Types
          </h3>
          <p className="text-sm text-gray-400">
            {compatibleChartTypes.length} of {chartTypes.length} charts
            available
          </p>
        </div>

        <div className="flex items-center space-x-4 overflow-x-auto">
          {compatibleChartTypes.map((chartType) => {
            const Icon = chartType.icon;
            return (
              <button
                key={chartType.type}
                onClick={() => handleChartTypeChange(chartType.type)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  selectedChartType === chartType.type
                    ? "bg-primary-500/30 text-primary-300 border border-primary-500/50"
                    : "hover:bg-white/10 text-gray-300"
                }`}
                title={chartType.description}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{chartType.label}</span>
              </button>
            );
          })}
        </div>

        {compatibleChartTypes.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-400">
              No compatible chart types for current selection
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please adjust your attribute selection to see available charts
            </p>
          </div>
        )}
      </div>

      {/* Main Chart Container */}
      <div className="glass-card p-6">
        <div
          className={`w-full ${
            isFullscreen ? "h-[calc(100vh-300px)]" : "h-96"
          }`}
        >
          {chartData &&
          selectedAttributes.length > 0 &&
          compatibleChartTypes.length > 0 ? (
            <div className="relative h-full">
              {renderChart(selectedChartType, chartData)}
              {/* Add Zoom Instructions */}
              {!["pie", "radar", "polarArea"].includes(selectedChartType) && (
                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
                  Ctrl+Wheel: Zoom • Ctrl+Drag: Pan
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Filter size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 mb-2">
                  {selectedAttributes.length === 0
                    ? "No attributes selected for visualization"
                    : "No compatible charts for current selection"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedAttributes.length === 0
                    ? "Please select attributes from the selector above to create charts"
                    : "Try selecting different attribute combinations"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Information Panel */}
      <div className="glass-card p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-500/20 rounded-lg">
            {React.createElement(
              chartTypes.find((ct) => ct.type === selectedChartType)?.icon ||
                LineChart,
              {
                size: 24,
                className: "text-primary-400",
              }
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {chartTypes.find((ct) => ct.type === selectedChartType)?.label}
            </h3>
            <p className="text-gray-400 mb-4">
              {
                chartTypes.find((ct) => ct.type === selectedChartType)
                  ?.description
              }
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Chart Type</span>
                <p className="text-white font-medium">{selectedChartType}</p>
              </div>
              <div>
                <span className="text-gray-500">Data Points</span>
                <p className="text-white font-medium">
                  {getFilteredData?.length || 0}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Attributes</span>
                <p className="text-white font-medium">
                  {selectedAttributes.length}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Created</span>
                <p className="text-white font-medium">
                  {new Date(dataset.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Filtered Data Preview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {selectedAttributes.map((attr) => (
                  <th
                    key={attr}
                    className="text-left py-2 px-4 text-gray-300 font-medium"
                  >
                    {attr.charAt(0).toUpperCase() + attr.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getFilteredData?.slice(0, 5).map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  {selectedAttributes.map((attr) => (
                    <td key={attr} className="py-2 px-4 text-gray-400">
                      {typeof row[attr] === "number"
                        ? row[attr].toLocaleString()
                        : String(row[attr])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredData && getFilteredData.length > 5 && (
            <p className="text-center text-gray-500 mt-4">
              Showing 5 of {getFilteredData.length} rows
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartView;
