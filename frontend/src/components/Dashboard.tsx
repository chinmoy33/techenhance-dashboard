import React from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Database,
  Users,
} from "lucide-react";
import { Dataset } from "../types";
//import Header from "./Header";

interface DashboardProps {
  datasets: Dataset[];
  onDatasetSelect: (datasetId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ datasets, onDatasetSelect }) => {
  const totalDataPoints = datasets.reduce(
    (sum, dataset) => sum + (dataset.dataPoints || 0),
    0
  );

  const stats = [
    {
      label: "Total Datasets",
      value: datasets.length,
      icon: Database,
      color: "text-blue-400",
    },
    {
      label: "Data Points",
      value: totalDataPoints.toLocaleString(),
      icon: Activity,
      color: "text-green-400",
    },
    {
      label: "Chart Types",
      value: "6+",
      icon: BarChart3,
      color: "text-purple-400",
    },
    // {
    //   label: "Active Users",
    //   value: "1",
    //   icon: Users,
    //   color: "text-orange-400",
    // },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400">
          Monitor your data visualizations and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <Icon size={24} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Datasets */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Available Datasets
          </h2>
          <div className="flex space-x-2">
            <PieChart size={20} className="text-purple-400" />
            <TrendingUp size={20} className="text-green-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              onClick={() => onDatasetSelect(dataset.id)}
              className="glass-card p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white truncate">
                  {dataset.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${dataset.type === "time_series"
                    ? "bg-blue-500/20 text-blue-300"
                    : dataset.type === "categorical"
                      ? "bg-purple-500/20 text-purple-300"
                      : dataset.type === "distribution"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                >
                  {dataset.type.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  {dataset.dataPoints || dataset.data?.length || 0} points
                </span>
                <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (dataset.dataPoints || 0) / 10)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {datasets.length === 0 && (
          <div className="text-center py-12">
            <Database size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No datasets available</p>
            <p className="text-sm text-gray-500 mt-2">
              Upload some data or generate sample datasets to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
