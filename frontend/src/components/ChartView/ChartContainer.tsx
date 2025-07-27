import React from "react";
import { Line, Bar, Pie, Scatter, Radar } from "react-chartjs-2";
import { ChartConfig } from "../../types";
import { Filter } from "lucide-react";

interface ChartContainerProps {
    selectedChartType: ChartConfig["type"];
    chartData: any;
    chartOptions: any;
    chartRef: React.MutableRefObject<any>;
    selectedAttributes: string[];
    compatibleChartTypes: { type: ChartConfig["type"] }[];
    isFullscreen: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
    selectedChartType,
    chartData,
    chartOptions,
    chartRef,
    selectedAttributes,
    compatibleChartTypes,
    isFullscreen,
}) => {
    /**
    * Renders the appropriate chart component based on type
    */
    const renderChart = (chartType: ChartConfig["type"], data: any) => {
        const commonProps = {
            ref: chartRef,
            data,
            options: chartOptions,
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
            case "scatter":
                return <Scatter {...commonProps} />;
            case "radar":
                return <Radar {...commonProps} />;
            default:
                return <Line {...commonProps} />;
        }
    };

    return (
        <div className="glass-card p-6">
            <div className={`w-full ${isFullscreen ? "h-[calc(100vh-250px)]" : "h-[525px]"}`}>
                {chartData && selectedAttributes.length > 0 && compatibleChartTypes.length > 0 ? (
                    <div className="relative h-full">
                        {renderChart(selectedChartType, chartData)}
                        {/* Add Zoom Instructions */}
                        {!["pie", "radar"].includes(selectedChartType) && (
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
    );
};

export default ChartContainer;