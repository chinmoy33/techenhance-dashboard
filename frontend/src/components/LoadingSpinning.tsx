import React from "react";
import { BarChart3, Sparkles } from "lucide-react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BarChart3 size={24} className="text-primary-400" />
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-4">
          <BarChart3 size={24} className="text-primary-400" />
          <Sparkles size={16} className="text-accent-400" />
          <h1 className="text-xl font-bold gradient-text">
            Data Visualizer Pro
          </h1>
        </div>

        <p className="text-gray-400 animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
