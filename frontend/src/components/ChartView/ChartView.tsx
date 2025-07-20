import React from "react";
import { ChartViewProps } from "./types";
import { useChartState } from "../hooks/useChartState";
import { useChartData } from "../hooks/useChartData";
import Header from "./Header";
import ChartTypeSelector from "./ChartTypeSelector";
import ChartContainer from "./ChartContainer";
import DataPreviewTable from "./DataPreviewTable";
import AttributeSelector from "../chartModules/AttributeSelector";
import RangeSelector from "../chartModules/RangeSelector";
import AllChartsView from "../chartModules/AllChartsViews";
import ChartPreview from "./ChartPreview";
import toast from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { isDateString } from "../utils/dateUtils";

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
    zoomPlugin,
    ChartDataLabels
);

const ChartView: React.FC<ChartViewProps> = ({
    dataset,
    initialChartType = "line",
    showAllCharts = false,
    onChartSelect,
}) => {
    const {
        selectedChartType,
        setSelectedChartType,
        selectedAttributes,
        setSelectedAttributes,
        isFullscreen,
        showSettings,
        showExport,
        setShowExport,
        setShowSettings,
        showAttributeSelector,
        setShowAttributeSelector,
        isSingleSelectedAttribute,
        selectedRange,
        setSelectedRange,
        chartConfig,
        chartRef,
        fullscreenRef,
        toggleFullscreen,
        resetZoom,
        updateChartConfig,
        resetSettings,
    } = useChartState(dataset, initialChartType);

    // Compute attribute types (similar to AttributeSelector)
    const attributeTypes: AttributeInfo[] = React.useMemo(() => {
        if (!dataset.data || dataset.data.length === 0) return [];
        const firstRow = dataset.data[0];
        const attributeNames = Object.keys(firstRow);

        return attributeNames.map((name) => {
            const values = dataset.data
                .map((row) => row[name])
                .filter((val) => val !== null && val !== undefined && val !== "");

            let type: "number" | "string" | "date" = "string";

            // Enhanced date detection
            // const isDateString = (val: string): boolean => {
            //     if (typeof val !== "string") return false;
            //     const trimmedVal = val.trim();
            //     if (trimmedVal === "") return false;

            //     const datePatterns = [
            //         /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/,
            //         /^\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}$/,
            //         /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2}$/,
            //         /^\d{1,2}\s+\w{3,9}\s+\d{4}$/,
            //         /^\w{3,9}\s+\d{1,2},?\s+\d{4}$/,
            //         /^\d{4}$/,
            //         /^\d{1,2}\/\d{4}$/,
            //         /^\d{4}-\d{2}$/,
            //     ];

            //     const matchesPattern = datePatterns.some((pattern) =>
            //         pattern.test(trimmedVal)
            //     );
            //     if (!matchesPattern) return false;

            //     let dateToTest = trimmedVal;
            //     if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/.test(trimmedVal)) {
            //         const parts = trimmedVal.split(/[\/\-\.]/);
            //         if (parts.length === 3) {
            //             dateToTest = `${parts[1]}/${parts[0]}/${parts[2]}`;
            //         }
            //     }

            //     const parsed = Date.parse(dateToTest);
            //     if (isNaN(parsed)) {
            //         if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/.test(trimmedVal)) {
            //             const parts = trimmedVal.split(/[\/\-\.]/);
            //             if (parts.length === 3) {
            //                 const day = parseInt(parts[0]);
            //                 const month = parseInt(parts[1]);
            //                 const year = parseInt(parts[2]);
            //                 if (
            //                     day >= 1 &&
            //                     day <= 31 &&
            //                     month >= 1 &&
            //                     month <= 12 &&
            //                     year >= 1900 &&
            //                     year <= 2100
            //                 ) {
            //                     return true;
            //                 }
            //             }
            //         }
            //         return false;
            //     }

            //     const date = new Date(parsed);
            //     const currentYear = new Date().getFullYear();
            //     const dateYear = date.getFullYear();
            //     return dateYear >= 1900 && dateYear <= currentYear + 10;
            // };

            const dateValues = values.filter((val) => isDateString(String(val)));
            if (dateValues.length > values.length * 0.8) {
                type = "date";
            } else {
                const numericValues = values.filter(
                    (val) =>
                        !isNaN(Number(val)) && val !== "" && !isDateString(String(val))
                );
                if (numericValues.length > values.length * 0.8) {
                    type = "number";
                }
            }

            return { name, type };
        });
    }, [dataset.data]);

    const {
        chartData,
        compatibleChartTypes,
        rangeLabels,
        supportsRangeSelector,
        chartOptions,
        getChartData,
        throttledHandleRangeChange,
    } = useChartData(
        dataset,
        selectedChartType,
        selectedAttributes,
        selectedRange,
        setSelectedRange,
        chartConfig,
        isFullscreen,
        attributeTypes // Pass attribute types
    );

    const handleChartTypeChange = (chartType: ChartConfig["type"]) => {
        const isCompatible = compatibleChartTypes.some((ct) => ct.type === chartType);
        if (!isCompatible) {
            toast.error(
                `${compatibleChartTypes.find((ct) => ct.type === chartType)?.label} is not compatible with current selection`
            );
            return;
        }
        setSelectedChartType(chartType);
        if (onChartSelect) {
            onChartSelect(chartType);
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
            const filteredData = dataset.data;
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
                renderChart={(chartType, data) => (
                    <ChartPreview
                        selectedChartType={chartType}
                        chartData={data}
                        chartOptions={chartOptions}
                    />
                )}
                onChartSelect={onChartSelect}
            />
        );
    }

    return (
        <div
            ref={fullscreenRef}
            className={`space-y-6 animate-fade-in ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto" : ""}`}
        >
            <Header
                dataset={dataset}
                selectedAttributes={selectedAttributes}
                selectedRange={selectedRange}
                isFullscreen={isFullscreen}
                showAttributeSelector={showAttributeSelector}
                showExport={showExport}
                showSettings={showSettings}
                selectedChartType={selectedChartType}
                toggleFullscreen={toggleFullscreen}
                setShowAttributeSelector={setShowAttributeSelector}
                setShowExport={setShowExport}
                setShowSettings={setShowSettings}
                chartConfig={chartConfig}
                updateChartConfig={updateChartConfig}
                resetSettings={resetSettings}
                resetZoom={resetZoom}
                exportChart={exportChart}
                exportData={exportData}
            />
            {showAttributeSelector && (
                <AttributeSelector
                    dataset={dataset}
                    selectedAttributes={selectedAttributes}
                    onAttributeChange={setSelectedAttributes}
                />
            )}
            <ChartTypeSelector
                selectedChartType={selectedChartType}
                compatibleChartTypes={compatibleChartTypes}
                handleChartTypeChange={handleChartTypeChange}
            />
            <ChartContainer
                selectedChartType={selectedChartType}
                chartData={chartData}
                chartOptions={chartOptions}
                chartRef={chartRef}
                selectedAttributes={selectedAttributes}
                compatibleChartTypes={compatibleChartTypes}
                isFullscreen={isFullscreen}
            />
            {supportsRangeSelector && rangeLabels.length > 1 && (
                <RangeSelector
                    data={dataset.data}
                    selectedRange={selectedRange}
                    onRangeChange={throttledHandleRangeChange}
                    labels={rangeLabels}
                />
            )}
            <DataPreviewTable
                dataset={dataset}
                selectedAttributes={selectedAttributes}
                filteredData={dataset.data}
            />
        </div>
    );
};

export default ChartView;