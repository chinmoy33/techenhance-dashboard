// A component-specific types.ts for ChartView-related types.
import { ChartConfig, Dataset } from "../../types";

export interface ChartViewProps {
  dataset: Dataset;
  initialChartType?: ChartConfig["type"];
  showAllCharts?: boolean;
  onChartSelect?: (chartType: ChartConfig["type"]) => void;
}
