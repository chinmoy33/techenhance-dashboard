import React, { useState, useMemo, useRef } from "react";
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
  Doughnut,
  Scatter,
  Radar,
  PolarArea,
  Bubble,
} from "react-chartjs-2";
import {
  Settings,
  Download,
  Maximize2,
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  Target,
  Zap,
  Activity,
  TrendingUp,
  Grid3X3,
  X,
  Palette,
  RotateCcw,
  Filter,
} from "lucide-react";
import { Dataset, ChartConfig } from "../types";
import AttributeSelector from "./chartModules/AttributeSelector";
import { chartTypes, colorThemes } from "./chartModules/ChartConstants";
import toast from "react-hot-toast";

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
  Filler
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
        const values = dataset.data
          .map((row) => row[key])
          .filter((val) => val !== null && val !== undefined && val !== "");
        const numericValues = values.filter(
          (val) => !isNaN(Number(val)) && val !== ""
        );
        return numericValues.length > values.length * 0.5; // At least 50% numeric
      });

      // Auto-select first 2-3 numeric columns or all if less than 3
      const autoSelected = numericColumns.slice(
        0,
        Math.min(3, numericColumns.length)
      );
      if (autoSelected.length === 0) {
        // If no numeric columns, select first 2 columns
        setSelectedAttributes(Object.keys(firstRow).slice(0, 2));
      } else {
        setSelectedAttributes(autoSelected);
      }
    }
  }, [dataset.data]);

  // ===== DATA PROCESSING FUNCTIONS =====

  /**
   * Filters dataset to only include selected attributes
   * @returns Filtered data array with only selected columns
   */
  const getFilteredData = () => {
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
  const getChartData = (chartType: ChartConfig["type"]) => {
    const filteredData = getFilteredData();
    if (!filteredData || filteredData.length === 0) return null;

    // Handle pie/doughnut/polar area charts (categorical data)
    if (
      chartType === "pie" ||
      chartType === "doughnut" ||
      chartType === "polarArea"
    ) {
      return generateCategoricalChartData(filteredData);
    }

    // Handle scatter/bubble charts (correlation data)
    if (chartType === "scatter" || chartType === "bubble") {
      return generateScatterChartData(filteredData, chartType);
    }

    // Handle radar charts (multi-dimensional data)
    if (chartType === "radar") {
      return generateRadarChartData(filteredData);
    }

    // Handle line/bar charts (time series or categorical comparison)
    return generateLineBarChartData(filteredData);
  };

  /**
   * Generates data for pie, doughnut, and polar area charts
   */
  const generateCategoricalChartData = (filteredData: any[]) => {
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
    chartType: "scatter" | "bubble"
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

  // ===== CHART CONFIGURATION =====

  /**
   * Generates Chart.js options based on chart type
   */
  const getChartOptions = (chartType: ChartConfig["type"]) => ({
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
      },
    },
    // Configure scales based on chart type
    scales: !["pie", "doughnut", "radar", "polarArea"].includes(chartType)
      ? {
          x: {
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
          y: {
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
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
      options: getChartOptions(chartType),
      className: "chart-container",
    };

    // Return appropriate chart component
    switch (chartType) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "pie":
        return <Pie {...commonProps} />;
      case "doughnut":
        return <Doughnut {...commonProps} />;
      case "scatter":
        return <Scatter {...commonProps} />;
      case "radar":
        return <Radar {...commonProps} />;
      case "polarArea":
        return <PolarArea {...commonProps} />;
      case "bubble":
        return <Bubble {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  // ===== EVENT HANDLERS =====

  /**
   * Handles chart type selection
   */
  const handleChartTypeChange = (chartType: ChartConfig["type"]) => {
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
      const filteredData = getFilteredData();
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
      <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
              <Grid3X3 size={24} className="text-primary-400" />
              <span>All Charts - {dataset.name}</span>
            </h1>
            <p className="text-gray-400">
              {dataset.dataPoints || dataset.data?.length || 0} data points •
              Click any chart to view in detail
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

        {/* All Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chartTypes.map((chartType) => {
            const Icon = chartType.icon;
            const data = getChartData(chartType.type);

            return (
              <div
                key={chartType.type}
                onClick={() => onChartSelect && onChartSelect(chartType.type)}
                className="glass-card p-4 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon size={16} className="text-primary-400" />
                    <h3 className="font-medium text-white text-sm">
                      {chartType.label}
                    </h3>
                  </div>
                </div>

                <div className="h-32 mb-3">
                  {data && renderChart(chartType.type, data)}
                </div>

                <p className="text-xs text-gray-400">{chartType.description}</p>
              </div>
            );
          })}
        </div>

        {/* Data Preview Section */}
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
                {getFilteredData()
                  ?.slice(0, 5)
                  .map((row, index) => (
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

            {getFilteredData() && getFilteredData().length > 5 && (
              <p className="text-center text-gray-500 mt-4">
                Showing 5 of {getFilteredData().length} rows
              </p>
            )}
          </div>
        </div>
      </div>
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

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            {showSettings && (
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

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
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

      {/* Chart Type Selector */}
      <div className="glass-card p-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {chartTypes.map((chartType) => {
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
      </div>

      {/* Main Chart Container */}
      <div className="glass-card p-6">
        <div
          className={`w-full ${
            isFullscreen ? "h-[calc(100vh-300px)]" : "h-96"
          }`}
        >
          {chartData && selectedAttributes.length > 0 ? (
            renderChart(selectedChartType, chartData)
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Filter size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 mb-2">
                  No attributes selected for visualization
                </p>
                <p className="text-sm text-gray-500">
                  Please select attributes from the selector above to create
                  charts
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Chart Settings</h3>
            <button
              onClick={resetSettings}
              className="glass-button px-3 py-1 rounded-lg flex items-center space-x-2 text-sm"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Chart Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chart Title
              </label>
              <input
                type="text"
                value={chartConfig.title}
                onChange={(e) => updateChartConfig({ title: e.target.value })}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
                placeholder="Enter chart title"
              />
            </div>

            {/* Color Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => updateChartConfig({ colors: theme.colors })}
                    className={`p-3 rounded-lg border transition-all ${
                      JSON.stringify(chartConfig.colors) ===
                      JSON.stringify(theme.colors)
                        ? "border-primary-400 bg-primary-500/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Palette size={14} className="text-gray-400" />
                      <span className="text-sm text-white">{theme.name}</span>
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
                  {getFilteredData()?.length || 0}
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
              {getFilteredData()
                ?.slice(0, 5)
                .map((row, index) => (
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

          {getFilteredData() && getFilteredData().length > 5 && (
            <p className="text-center text-gray-500 mt-4">
              Showing 5 of {getFilteredData().length} rows
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartView;
