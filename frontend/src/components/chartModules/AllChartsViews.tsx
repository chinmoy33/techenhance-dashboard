import React from "react";
import { Filter, Grid3X3 } from "lucide-react";
import { Dataset, ChartConfig } from "../../types";
import AttributeSelector from "./AttributeSelector";

interface AllChartsViewProps {
  dataset: Dataset;
  selectedAttributes: string[];
  setSelectedAttributes: (attributes: string[]) => void;
  showAttributeSelector: boolean;
  setShowAttributeSelector: (show: boolean) => void;
  compatibleChartTypes: {
    type: ChartConfig["type"];
    label: string;
    icon: any;
    description: string;
    compatibility: string[];
  }[];
  getChartData: (chartType: ChartConfig["type"]) => any;
  renderChart: (
    chartType: ChartConfig["type"],
    data: any
  ) => JSX.Element | null;
  onChartSelect?: (chartType: ChartConfig["type"]) => void;
}

const AllChartsView: React.FC<AllChartsViewProps> = ({
  dataset,
  selectedAttributes,
  setSelectedAttributes,
  showAttributeSelector,
  setShowAttributeSelector,
  compatibleChartTypes,
  getChartData,
  renderChart,
  onChartSelect,
}) => {
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
            Showing {compatibleChartTypes.length} compatible charts
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

      {/* Compatible Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {compatibleChartTypes.map((chartType) => {
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

      {/* No Compatible Charts Message */}
      {compatibleChartTypes.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Filter size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No Compatible Charts
          </h3>
          <p className="text-gray-400 mb-4">
            Please select appropriate attributes to view compatible
            visualizations
          </p>
          <button
            onClick={() => setShowAttributeSelector(true)}
            className="glass-button px-6 py-3 rounded-lg"
          >
            Select Attributes
          </button>
        </div>
      )}

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
              {dataset.data?.slice(0, 5).map((row, index) => (
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

export default AllChartsView;
