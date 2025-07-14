import React from "react";
import { ChartConfig } from "../../types";
import { chartTypes } from "../constants/ChartConstants";
import toast from "react-hot-toast";

interface ChartTypeSelectorProps {
    selectedChartType: ChartConfig["type"];
    compatibleChartTypes: { type: ChartConfig["type"]; label: string; icon: any; description: string; compatibility: string[] }[];
    handleChartTypeChange: (chartType: ChartConfig["type"]) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
    selectedChartType,
    compatibleChartTypes,
    handleChartTypeChange,
}) => {
    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Compatible Chart Types</h3>
                <p className="text-sm text-gray-400">
                    {compatibleChartTypes.length} of {chartTypes.length} charts available
                </p>
            </div>
            <div className="flex items-center space-x-4 overflow-x-auto">
                {compatibleChartTypes.map((chartType) => {
                    const Icon = chartType.icon;
                    return (
                        <button
                            key={chartType.type}
                            onClick={() => handleChartTypeChange(chartType.type)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${selectedChartType === chartType.type
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
                    <p className="text-gray-400">No compatible chart types for current selection</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Please adjust your attribute selection to see available charts
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChartTypeSelector;