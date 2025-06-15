import React, { useState, useMemo } from "react";
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
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Scatter } from "react-chartjs-2";
import {
  // Settings,
  // Download,
  Maximize2,
  BarChart3,
  LineChart,
  X,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Dataset, ChartConfig } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartViewProps {
  dataset: Dataset;
}

const ChartView: React.FC<ChartViewProps> = ({ dataset }) => {
  const [selectedChartType, setSelectedChartType] =
    useState<ChartConfig["type"]>("line");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: "line",
    title: `${dataset.name} Visualization`,
  });

  const chartTypes = [
    { type: "line" as const, label: "Line Chart", icon: LineChart },
    { type: "bar" as const, label: "Bar Chart", icon: BarChart3 },
    { type: "pie" as const, label: "Pie Chart", icon: PieChartIcon },
    { type: "doughnut" as const, label: "Doughnut", icon: PieChartIcon },
    { type: "scatter" as const, label: "Scatter Plot", icon: BarChart3 },
  ];

  const chartData = useMemo(() => {
    const data = dataset.data;
    if (!data || data.length === 0) return null;

    const colors = [
      "rgba(59, 130, 246, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(236, 72, 153, 0.8)",
    ];

    if (selectedChartType === "pie" || selectedChartType === "doughnut") {
      // For pie/doughnut charts, use categorical data
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
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 2,
          },
        ],
      };
    }

    if (selectedChartType === "scatter") {
      return {
        datasets: [
          {
            label: dataset.name,
            data: data.map((item) => ({
              x: item.x || item.sales || item.value || Math.random() * 100,
              y: item.y || item.revenue || item.count || Math.random() * 100,
            })),
            backgroundColor: colors[0],
            borderColor: colors[0].replace("0.8", "1"),
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      };
    }

    // For line/bar charts
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
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace("0.8", "1"),
        borderWidth: 2,
        fill: selectedChartType === "line" ? false : true,
        tension: 0.4,
      });
    });

    return { labels, datasets };
  }, [dataset.data, selectedChartType]);

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
      selectedChartType !== "pie" && selectedChartType !== "doughnut"
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

  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
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
      default:
        return <Line {...commonProps} />;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`space-y-6 animate-fade-in ${
        isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <h1 className="text-2xl font-bold text-white mb-2">{dataset.name}</h1>
          <p className="text-gray-400">
            {dataset.dataPoints || dataset.data?.length || 0} data points •{" "}
            {dataset.type.replace("_", " ")}
          </p>

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
                onClick={() => setSelectedChartType(chartType.type)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  selectedChartType === chartType.type
                    ? "bg-primary-500/30 text-primary-300 border border-primary-500/50"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{chartType.label}</span>
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
        <h3 className="text-lg font-semibold text-white mb-4">Data Preview</h3>
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
    </div>
  );
};

export default ChartView;
