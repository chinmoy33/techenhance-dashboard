import React, { useState, useMemo, useRef } from "react";

// Import Chart.js components - a popular charting library for web applications
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

// Import React wrappers for different chart types
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

// Import Lucide React icons for the UI
import {
  Download,
  Maximize2,
  BarChart3,
  LineChart,
  X,
  PieChart as PieChartIcon,
  Target,
  Zap,
  Settings,
  Upload,
  Grid3X3,
  Activity,
  TrendingUp,
} from "lucide-react";

// Import TypeScript types (assuming they exist in a types file)
import { Dataset, ChartConfig } from "../types";
// Import toast notifications for user feedback
import toast from "react-hot-toast";

// Register Chart.js components - required for Chart.js to work properly
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

// Define the props interface for the component
interface ChartViewProps {
  dataset: Dataset; // The data to be visualized
  initialChartType?: ChartConfig["type"]; //Sets the default chart type (defaults to "line" if not provided).
  showAllCharts?: boolean;
  onChartSelect?: (chartType: ChartConfig["type"]) => void;
}

// Main ChartView component - displays interactive charts with multiple visualization types
const ChartView: React.FC<ChartViewProps> = ({
  dataset,
  initialChartType = "line",
  showAllCharts = false,
  onChartSelect,
}) => {
  const [selectedChartType, setSelectedChartType] = useState<
    ChartConfig["type"]
  >(initialChartType || "line");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: initialChartType || "line",
    title: `${dataset.name} Visualization`,
    colors: [
      "rgba(59, 130, 246, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(14, 165, 233, 0.8)",
      "rgba(168, 85, 247, 0.8)",
    ],
  });

  // Add for CSV import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ref to access the chart instance for export functionality
  const chartRef = useRef<any>(null);

  // Configuration for different chart types with their icons and descriptions
  const chartTypes = [
    {
      type: "line" as const,
      label: "Line Chart",
      icon: LineChart,
      description: "Show trends over time",
    },
    {
      type: "bar" as const,
      label: "Bar Chart",
      icon: BarChart3,
      description: "Compare categories",
    },
    {
      type: "pie" as const,
      label: "Pie Chart",
      icon: PieChartIcon,
      description: "Show proportions",
    },
    {
      type: "doughnut" as const,
      label: "Doughnut",
      icon: PieChartIcon,
      description: "Modern pie chart",
    },
    {
      type: "scatter" as const,
      label: "Scatter Plot",
      icon: Target,
      description: "Show correlations",
    },
    {
      type: "radar" as const,
      label: "Radar Chart",
      icon: Zap,
      description: "Multi-dimensional data",
    },
    {
      type: "polarArea" as const,
      label: "Polar Area",
      icon: Activity,
      description: "Radial bar chart",
    },
    {
      type: "bubble" as const,
      label: "Bubble Chart",
      icon: TrendingUp,
      description: "3D scatter plot",
    },
  ];

  // Memoized chart data processing - recalculates only when dataset or chart type changes
  const chartData = useMemo(() => {
    const data = dataset.data;

    if (!data || data.length === 0) return null;

    if (
      selectedChartType === "pie" ||
      selectedChartType === "doughnut" ||
      selectedChartType === "polarArea"
    ) {
      const labels = data.map(
        (item, index) =>
          item.category || item.label || item.name || `Item ${index + 1}`
      );
      const values = data.map(
        (item) =>
          item.value || item.count || item.y || Object.values(item)[1] || 1
      );

      return {
        labels,
        datasets: [
          {
            label: dataset.name,
            data: values,
            backgroundColor: chartConfig.colors,
            borderColor: chartConfig.colors.map((color) =>
              color.replace("0.8", "1")
            ),
            borderWidth: 2,
          },
        ],
      };
    }

    if (selectedChartType === "scatter" || selectedChartType === "bubble") {
      const scatterData = data.map((item) => ({
        x: item.x || item.sales || item.value || Math.random() * 100,
        y: item.y || item.revenue || item.count || Math.random() * 100,
        r:
          selectedChartType === "bubble"
            ? item.size || item.profit || Math.random() * 20 + 5
            : undefined,
      }));

      return {
        datasets: [
          {
            label: dataset.name,
            data: scatterData,
            backgroundColor: chartConfig.colors[0],
            borderColor: chartConfig.colors[0].replace("0.8", "1"),
            pointRadius: selectedChartType === "bubble" ? undefined : 6,
            pointHoverRadius: selectedChartType === "bubble" ? undefined : 8,
          },
        ],
      };
    }

    if (selectedChartType === "radar") {
      const keys = Object.keys(data[0] || {}).filter(
        (key) =>
          key !== "month" &&
          key !== "category" &&
          key !== "label" &&
          key !== "x" &&
          typeof data[0][key] === "number"
      );

      const labels = keys.map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      );
      const avgValues = keys.map((key) => {
        const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
        return sum / data.length;
      });

      return {
        labels,
        datasets: [
          {
            label: dataset.name,
            data: avgValues,
            backgroundColor: chartConfig.colors[0],
            borderColor: chartConfig.colors[0].replace("0.8", "1"),
            borderWidth: 2,
            fill: true,
          },
        ],
      };
    }

    const labels = data.map(
      (item, index) =>
        item.month ||
        item.category ||
        item.label ||
        item.x ||
        `Point ${index + 1}`
    );

    const datasets = [];
    const keys = Object.keys(data[0] || {}).filter(
      (key) =>
        key !== "text" &&
        key !== "month" &&
        key !== "category" &&
        key !== "label" &&
        key !== "x" &&
        typeof data[0][key] === "number"
    );

    keys.forEach((key, index) => {
      datasets.push({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: data.map((item) => item[key]),
        backgroundColor: chartConfig.colors[index % chartConfig.colors.length],
        borderColor: chartConfig.colors[
          index % chartConfig.colors.length
        ].replace("0.8", "1"),
        borderWidth: 2,
        fill: selectedChartType === "line" ? false : true,
        tension: 0.4,
      });
    });

    return { labels, datasets };
  }, [dataset.data, selectedChartType, chartConfig.colors]);

  // Chart.js configuration options
  const chartOptions = {
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
        text: chartConfig.title,
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
    scales:
      selectedChartType === "radar"
        ? {
            r: {
              ticks: { color: "rgba(255, 255, 255, 0.7)" },
              grid: { color: "rgba(255, 255, 255, 0.2)" },
              pointLabels: { color: "rgba(255, 255, 255, 0.8)" },
            },
          }
        : selectedChartType !== "pie" &&
          selectedChartType !== "doughnut" &&
          selectedChartType !== "polarArea"
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
        : {},
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  // Function to render the appropriate chart component based on selected type
  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      ref: chartRef,
      data: chartData,
      options: chartOptions,
      className: "chart-container",
    };

    switch (selectedChartType) {
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

  const handleChartTypeChange = (chartType: ChartConfig["type"]) => {
    setSelectedChartType(chartType);
    if (onChartSelect) {
      onChartSelect(chartType);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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

  const exportData = (format: "csv" | "json") => {
    try {
      let content = "";
      let mimeType = "";
      let extension = "";

      if (format === "csv") {
        const headers = Object.keys(dataset.data[0] || {});
        const csvContent = [
          headers.join(","),
          ...dataset.data.map((row) =>
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
        content = JSON.stringify(dataset.data, null, 2);
        mimeType = "application/json";
        extension = "json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataset.name}-data.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        const data = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(",").map((v) => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
              const value = values[index];
              row[header] = isNaN(Number(value)) ? value : Number(value);
            });
            return row;
          });

        toast.success(`Imported ${data.length} rows from CSV`);
        setShowImportModal(false);
      } catch (error) {
        toast.error("Failed to parse CSV file");
        console.error("CSV parse error:", error);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div
      className={`space-y-6 animate-fade-in ${
        isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto" : ""
      }`}
    >
      {showAllCharts ? (
        <div className="space-y-6 animate-fade-in">
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

            <div className="flex space-x-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>Import CSV</span>
              </button>
            </div>
          </div>

          {/* All Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {chartTypes.map((chartType) => {
              const Icon = chartType.icon;
              const data = chartData; // Use chartData with the specific chart type
              return (
                <div
                  key={chartType.type}
                  onClick={() => handleChartTypeChange(chartType.type)}
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
                    {data && (
                      <div className="chart-container">
                        {(() => {
                          const commonProps = {
                            data,
                            options: {
                              ...chartOptions,
                              plugins: {
                                ...chartOptions.plugins,
                                title: {
                                  ...chartOptions.plugins.title,
                                  text: chartType.label,
                                },
                              },
                              scales:
                                chartType.type === "radar"
                                  ? chartOptions.scales
                                  : chartType.type !== "pie" &&
                                    chartType.type !== "doughnut" &&
                                    chartType.type !== "polarArea"
                                  ? chartOptions.scales
                                  : {},
                            },
                            className: "chart-container",
                          };
                          switch (chartType.type) {
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
                        })()}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400">
                    {chartType.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Data Preview */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Data Preview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {dataset.data?.[0] &&
                      Object.keys(dataset.data[0]).map((key) => (
                        <th
                          key={key}
                          className="text-left py-2 px-4 text-gray-300 font-medium"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {dataset.data?.slice(0, 5).map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="py-2 px-4 text-gray-400">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {dataset.data && dataset.data.length > 5 && (
                <p className="text-center text-gray-500 mt-4">
                  Showing 5 of {dataset.data.length} rows
                </p>
              )}
            </div>
          </div>

          {/* Import CSV Modal */}
          {showImportModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-card p-6 max-w-md w-full mx-4 animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Import CSV Data
                  </h3>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-400">
                    Select a CSV file to import data. The first row should
                    contain column headers.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full glass-button p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-primary-400/50 transition-all"
                  >
                    <Upload
                      size={24}
                      className="mx-auto mb-2 text-primary-400"
                    />
                    <p className="text-white font-medium">Choose CSV File</p>
                    <p className="text-sm text-gray-400">
                      Click to browse files
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {dataset.name}
              </h1>
              <p className="text-gray-400">
                {dataset.dataPoints || dataset.data?.length || 0} data points •{" "}
                {dataset.type.replace("_", " ")}
              </p>
            </div>

            <div className="flex space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>

                {showExportDropdown && (
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
                        CSV File
                      </button>
                      <button
                        onClick={() => exportData("json")}
                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm text-gray-300"
                      >
                        JSON File
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
            </div>
          </div>

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
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">
                      {chartType.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Container */}
          <div className="glass-card p-6">
            <div
              className={`w-full ${
                isFullscreen ? "h-[calc(100vh-300px)]" : "h-96"
              }`}
            >
              {renderChart()}
            </div>
          </div>

          {/* Data Preview */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Data Preview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {dataset.data?.[0] &&
                      Object.keys(dataset.data[0]).map((key) => (
                        <th
                          key={key}
                          className="text-left py-2 px-4 text-gray-300 font-medium"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {dataset.data?.slice(0, 5).map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="py-2 px-4 text-gray-400">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {dataset.data && dataset.data.length > 5 && (
                <p className="text-center text-gray-500 mt-4">
                  Showing 5 of {dataset.data.length} rows
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartView;
