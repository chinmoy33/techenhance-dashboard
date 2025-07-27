import {
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  Target,
  Zap,
  Activity,
  // TrendingUp,
  BarChart2,
} from "lucide-react";

// ===== CHART TYPE DEFINITIONS =====
// Available chart types with their metadata and compatibility rules
export const chartTypes = [
  {
    type: "line" as const,
    label: "Line Chart",
    icon: LineChart,
    description: "Show trends over time",
    compatibility: ["1-numeric", "1-numeric-1-categorical", "2-numeric"],
    supportsRange: true,
  },
  {
    type: "bar" as const,
    label: "Bar Chart",
    icon: BarChart3,
    description: "Compare categories",
    compatibility: ["1-categorical", "1-numeric-1-categorical"],
    supportsRange: true,
  },
  {
    type: "histogram" as const,
    label: "Histogram",
    icon: BarChart2,
    description: "Show data distribution",
    compatibility: ["1-numeric"],
    supportsRange: false,
  },
  {
    type: "pie" as const,
    label: "Pie Chart",
    icon: PieChartIcon,
    description: "Show proportions",
    compatibility: ["1-categorical"],
    supportsRange: false,
  },
  {
    type: "scatter" as const,
    label: "Scatter Plot",
    icon: Target,
    description: "Show correlations",
    compatibility: ["2-numeric", "1-categorical"],
    supportsRange: true,
  },
  {
    type: "radar" as const,
    label: "Radar Chart",
    icon: Zap,
    description: "Multi-dimensional data",
    compatibility: ["2-numeric", "3-numeric"],
    supportsRange: false,
  },
];

// ===== COLOR THEMES =====
// Predefined color themes for charts
export const colorThemes = [
  {
    name: "Default",
    colors: [
      "rgba(59, 130, 246, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(14, 165, 233, 0.8)",
      "rgba(168, 85, 247, 0.8)",
    ],
  },
  {
    name: "Ocean",
    colors: [
      "rgba(6, 182, 212, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(99, 102, 241, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(168, 85, 247, 0.8)",
      "rgba(192, 132, 252, 0.8)",
      "rgba(196, 181, 253, 0.8)",
      "rgba(221, 214, 254, 0.8)",
    ],
  },
  {
    name: "Sunset",
    colors: [
      "rgba(251, 146, 60, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(168, 85, 247, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(99, 102, 241, 0.8)",
      "rgba(59, 130, 246, 0.8)",
    ],
  },
  {
    name: "Forest",
    colors: [
      "rgba(34, 197, 94, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(6, 182, 212, 0.8)",
      "rgba(14, 165, 233, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(99, 102, 241, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(168, 85, 247, 0.8)",
    ],
  },
];
