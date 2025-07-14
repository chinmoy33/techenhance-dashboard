import { ChartConfig, Dataset } from "../../types";
import { chartTypes } from "../constants/ChartConstants";

/**
 * Generates Chart.js options based on chart type
 */
export const getChartOptions = (
  chartType: ChartConfig["type"],
  isSingleSelectedAttribute: boolean,
  xLabel: string | undefined,
  yLabel: string[] | undefined,
  datasetName: string,
  chartConfig: ChartConfig,
  isFullscreen: boolean
) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "rgba(255, 255, 255, 0.8)",
        font: { size: isFullscreen ? 14 : 12 },
      },
    },
    title: {
      display: true,
      text:
        chartConfig.title ||
        `${datasetName} - ${
          chartTypes.find((ct) => ct.type === chartType)?.label
        }`,
      color: "rgba(255, 255, 255, 0.9)",
      font: { size: isFullscreen ? 20 : 16, weight: "bold" },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      titleFont: { size: isFullscreen ? 14 : 12 },
      bodyFont: { size: isFullscreen ? 12 : 10 },
      // Custom tooltip for histogram
      callbacks:
        chartType === "pie" || chartType === "polarArea"
          ? {
              label: function (context: any) {
                const dataset = context.dataset;
                const value = dataset.data[context.dataIndex];
                const total = dataset.data.reduce(
                  (sum: number, val: number) => sum + val,
                  0
                );
                const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${value} (${percent}%)`;
              },
            }
          : chartType === "histogram"
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
    datalabels:
      chartType === "pie" || chartType === "polarArea"
        ? {
            display: true,
            formatter: (value: number, context: any) => {
              const total = context.dataset.data.reduce(
                (sum: number, val: number) => sum + val,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            },
            color: "white",
            font: {
              weight: "bold" as const,
              size: isFullscreen ? 14 : 12,
            },
            textStrokeColor: "rgba(0, 0, 0, 0.8)",
            textStrokeWidth: 2,
          }
        : { display: false },
    // Added zoom plugin configuration
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
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: { size: isFullscreen ? 12 : 10 },
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          title: {
            display: !!xLabel || chartType === "histogram",
            text: chartType === "histogram" ? "Value Range" : xLabel || "",
            color: "rgba(255, 255, 255, 0.8)",
            font: { size: isFullscreen ? 14 : 12 },
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
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: { size: isFullscreen ? 12 : 10 },
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          title: {
            display: !!yLabel || chartType === "histogram",
            text: chartType === "histogram" ? "Frequency" : yLabel || "",
            color: "rgba(255, 255, 255, 0.8)",
            font: { size: isFullscreen ? 14 : 12 },
          },
          beginAtZero: chartType === "histogram",
        },
      }
    : chartType === "radar"
    ? {
        r: {
          ticks: {
            color: "rgba(255, 255, 255, 0.7)",
            font: { size: isFullscreen ? 12 : 10 },
          },
          grid: { color: "rgba(255, 255, 255, 0.2)" },
          pointLabels: {
            color: "rgba(255, 255, 255, 0.8)",
            font: { size: isFullscreen ? 12 : 10 },
          },
        },
      }
    : {},
  animation: {
    duration: 1000,
    easing: "easeInOutQuart",
  },
});
