// Represents a dataset object with metadata and data array
export interface Dataset {
  // id: string;
  id: number;
  name: string;
  data: any[];
  type:
    | "time_series"
    | "categorical"
    | "distribution"
    | "generic"
    | "uploaded"
    | "generated";
  createdAt: string;
  updatedAt?: string;
  dataPoints?: number;
}

// Configuration for a chart visualization
export interface ChartConfig {
  type: "line" | "bar" | "pie" | "scatter" | "radar" | "histogram";
  title: string;
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

// Supported view types in the app
export type ViewType =
  | "dashboard"
  | "charts"
  | "allCharts"
  | "data"
  | "account";
