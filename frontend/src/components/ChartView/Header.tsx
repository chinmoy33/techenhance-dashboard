import React from "react";
import { Download, Filter, Maximize2, Minimize2, Settings, RotateCcw, Palette, ZoomOut, BarChart3 } from "lucide-react";
import { Dataset, ChartConfig } from "../../types";
import { colorThemes } from "../constants/ChartConstants";

interface HeaderProps {
  dataset: Dataset;
  selectedAttributes: string[];
  selectedRange: [number, number];
  isFullscreen: boolean;
  showAttributeSelector: boolean;
  showExport: boolean;
  showSettings: boolean;
  selectedChartType: ChartConfig["type"];
  toggleFullscreen: () => void;
  setShowAttributeSelector: (show: boolean) => void;
  setShowExport: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  chartConfig: ChartConfig;
  updateChartConfig: (updates: Partial<ChartConfig>) => void;
  resetSettings: () => void;
  resetZoom: () => void;
  exportChart: (format: "png" | "jpg" | "svg" | "pdf") => void;
  exportData: (format: "csv" | "json") => void;

}

const Header: React.FC<HeaderProps> = ({
  dataset,
  selectedAttributes,
  selectedRange,
  isFullscreen,
  showAttributeSelector,
  showExport,
  showSettings,
  selectedChartType,
  toggleFullscreen,
  setShowAttributeSelector,
  setShowExport,
  setShowSettings,
  chartConfig,
  updateChartConfig,
  resetSettings,
  resetZoom,
  exportChart,
  exportData,
}) => {

  let attribute1;
  let attribute2;
  let attribute3;
  if (window.innerWidth <= 768) {
    attribute1 = "flex sm:flex-row  p-4 sm:p-0";
    attribute2 = "grid grid-cols-2 gap-2 mt-2";
    attribute3 = "left-0";
  } else {
    attribute1 = "";
    attribute2 = "flex items-center space-x-2"
    attribute3 = "right-0"
  }
  return (
    <div className={`flex-col  ${attribute1} items-center justify-between`}>
      {/* Left Section: Header Title and Sentences */}
      <div className="flex items-center space-x-2 mr-auto">
        <BarChart3 size={32} className="text-primary-400" />
        <span className="text-2xl font-bold text-primary-400">Charts</span>
      </div>

      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        <p className="text-gray-300 text-2xl mb-1">
          Selected Dataset: <span className="font-medium text-white">{dataset.name}</span>
        </p>
        <p className="text-gray-400 text-sm sm:text-base break-words">
          {dataset.dataPoints || dataset.data?.length || 0} data points •{" "}
          {selectedAttributes.length} attributes selected
          {selectedRange[0] !== selectedRange[1] &&
            ` • Showing ${selectedRange[1] - selectedRange[0] + 1} of ${dataset.data?.length || 0
            } points`}
        </p>
      </div>

      {/* Right Section: Control Buttons */}
      <div className={`flex flex-wrap justify-end gap-2 ${attribute2}`}>
        <button
          onClick={() => setShowAttributeSelector(!showAttributeSelector)}
          className={`glass-button rounded-lg w-full sm:w-auto h-10 flex items-center justify-center space-x-2 text-sm px-4 ${showAttributeSelector ? "bg-primary-500/20 border-primary-500/50" : ""
            }`}
        >
          <Filter size={16} />
          <span>Attributes</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowExport(!showExport)}
            className="glass-button rounded-lg w-full sm:w-auto h-10 flex items-center justify-center space-x-2 text-sm px-4"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          {showExport && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-card p-3 rounded-lg z-10">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white mb-2">Export Chart</p>
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
                <p className="text-sm font-medium text-white mb-2">Export Data</p>
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
          className="glass-button rounded-lg w-full sm:w-auto h-10 flex items-center justify-center space-x-2 text-sm px-4"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
        </button>

        {!["pie", "radar"].includes(selectedChartType) && (
          <button
            onClick={resetZoom}
            className="glass-button rounded-lg w-full sm:w-auto h-10 flex items-center justify-center space-x-2 text-sm px-4"
            title="Reset Zoom"
          >
            <ZoomOut size={16} />
            <span>Reset Zoom</span>
          </button>
        )}

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="glass-button rounded-lg w-full sm:w-auto h-10 flex items-center justify-center space-x-2 text-sm px-4"
          >
            {window.innerWidth >= 319 && <Settings size={16} />}
            <span>Settings</span>
          </button>
          {/* Settings Panel */}
          {showSettings && (
            <div
              className={`absolute ${attribute3} top-full mt-2 w-80 sm:w-80 glass-card p-4 rounded-lg z-10`}
            >
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
                    onChange={(e) => updateChartConfig({ title: e.target.value })}
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
                        onClick={() => updateChartConfig({ colors: theme.colors })}
                        className={`p-2 rounded-lg border transition-all text-left ${JSON.stringify(chartConfig.colors) ===
                          JSON.stringify(theme.colors)
                          ? "border-primary-400 bg-primary-500/20"
                          : "border-white/20 hover:border-white/40"
                          }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Palette size={12} className="text-gray-400" />
                          <span className="text-xs text-white">{theme.name}</span>
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
  );
};

export default Header;