import React from "react";
import { Line, Bar, Pie, Scatter, Radar, PolarArea } from "react-chartjs-2";
import { ChartConfig } from "../../types";

interface ChartPreviewProps {
    selectedChartType: ChartConfig["type"];
    chartData: any;
    chartOptions: any;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
    selectedChartType,
    chartData,
    chartOptions,
}) => {
    const renderChart = (chartType: ChartConfig["type"], data: any) => {
        const commonProps = {
            data,
            options: {
                ...chartOptions,
                maintainAspectRatio: false,
                plugins: {
                    ...chartOptions.plugins,
                    zoom: undefined, // Disable zoom for previews
                    legend: {
                        display: true, // Show legend for better context in larger charts
                        labels: { font: { size: 10 } } // Smaller font for legend
                    },
                    title: {
                        display: true, // Show title for better context
                        font: { size: 12 }, // Smaller font for title
                        color: "rgba(255, 255, 255, 0.9)"
                    },
                    datalabels: {
                        ...chartOptions.plugins.datalabels,
                        font: { size: 10 }, // Adjusted datalabels font size
                    },
                },
                scales:
                    chartType === "radar"
                        ? {
                            r: {
                                ticks: { display: true, font: { size: 8 } },
                                grid: { color: "rgba(255, 255, 255, 0.1)" },
                                pointLabels: { font: { size: 10 } }, // Slightly larger for readability
                            },
                        }
                        : chartType !== "pie" && chartType !== "polarArea"
                            ? {
                                x: {
                                    display: true, // Show axes for better context
                                    ticks: { font: { size: 8 }, color: "rgba(255, 255, 255, 0.7)" },
                                    grid: { display: false },
                                },
                                y: {
                                    display: true,
                                    ticks: { font: { size: 8 }, color: "rgba(255, 255, 255, 0.7)" },
                                    grid: { display: false },
                                },
                            }
                            : {},
            },
            className: "w-full h-64",
        };

        switch (chartType) {
            case "line":
                return <Line {...commonProps} />;
            case "bar":
                return <Bar {...commonProps} />;
            case "histogram":
                return <Bar {...commonProps} />;
            case "pie":
                return <Pie {...commonProps} />;
            case "scatter":
                return <Scatter {...commonProps} />;
            case "radar":
                return <Radar {...commonProps} />;
            case "polarArea":
                return <PolarArea {...commonProps} />;
            default:
                return <Line {...commonProps} />;
        }
    };

    return (
        <div className="w-full h-64">
            {chartData ? renderChart(selectedChartType, chartData) : null}
        </div>
    );
};

export default ChartPreview;