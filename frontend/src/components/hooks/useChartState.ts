// State management hook
import { useState, useEffect, useCallback, useRef } from "react";
import { ChartConfig, Dataset } from "../../types";
import { colorThemes } from "../constants/ChartConstants";
import toast from "react-hot-toast";

export const useChartState = (
  dataset: Dataset,
  initialChartType: ChartConfig["type"]
) => {
  const [selectedChartType, setSelectedChartType] =
    useState<ChartConfig["type"]>(initialChartType);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAttributeSelector, setShowAttributeSelector] = useState(true);
  const [isSingleSelectedAttribute, setIsSingleSelectedAttribute] =
    useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<[number, number]>([0, 0]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: initialChartType,
    title: `${dataset.name} Visualization`,
    colors: colorThemes[0].colors,
  });

  const chartRef = useRef<any>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // ===== AUTO-INITIALIZATION EFFECT =====
  // Initialize selected attributes when dataset changes
  useEffect(() => {
    if (
      dataset.data &&
      dataset.data.length > 0 &&
      selectedAttributes.length === 0
    ) {
      const firstRow = dataset.data[0];

      // Find numeric columns by checking if values can be converted to numbers
      const numericColumns = Object.keys(firstRow).filter((key) => {
        if (
          key === "CHQ.NO" ||
          key === "Account Number" ||
          key === "Transaction Number or ID"
        )
          return false; // Skip this column
        const values = dataset.data
          .map((row) => row[key])
          .filter((val) => val !== null && val !== undefined && val !== "");
        const numericValues = values.filter(
          (val) => !isNaN(Number(val)) && val !== ""
        );
        return numericValues.length > values.length * 0.5; // At least 50% numeric
      });

      // Auto-select first 2 numeric columns or all if less than 2
      const autoSelected = numericColumns.slice(
        0,
        Math.min(2, numericColumns.length)
      );
      if (autoSelected.length === 0) {
        // If no numeric columns, select first columns
        setSelectedAttributes(Object.keys(firstRow).slice(0, 1));
      } else {
        setSelectedAttributes(autoSelected);
      }
    }
    // Initialize range selector
    if (dataset.data) {
      setSelectedRange([0, dataset.data.length - 1]);
    }
  }, [dataset.data]);

  // ===== FULLSCREEN FUNCTIONALITY =====
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      fullscreenRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
          // Fallback to custom fullscreen
          setIsFullscreen(true);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
          setIsFullscreen(false);
        });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  /**
   * Resets chart zoom to original view
   */
  const resetZoom = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      toast.success("Chart zoom reset");
    }
  }, []);

  /**
   * Updates chart configuration
   */
  const updateChartConfig = useCallback((updates: Partial<ChartConfig>) => {
    setChartConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Resets settings to default
   */
  const resetSettings = useCallback(() => {
    setChartConfig({
      type: selectedChartType,
      title: `${dataset.name} Visualization`,
      colors: colorThemes[0].colors,
    });
    toast.success("Settings reset to default");
  }, [dataset.name, selectedChartType]);

  return {
    selectedChartType,
    setSelectedChartType,
    selectedAttributes,
    setSelectedAttributes,
    isFullscreen,
    setIsFullscreen,
    showSettings,
    setShowSettings,
    showExport,
    setShowExport,
    showAttributeSelector,
    setShowAttributeSelector,
    isSingleSelectedAttribute,
    setIsSingleSelectedAttribute,
    selectedRange,
    setSelectedRange,
    chartConfig,
    chartRef,
    fullscreenRef,
    toggleFullscreen,
    resetZoom,
    updateChartConfig,
    resetSettings,
  };
};
