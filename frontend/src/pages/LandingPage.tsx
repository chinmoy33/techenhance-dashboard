import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  PieChart,
  LineChart,
  Activity,
  Users,
  Database,
  ArrowRight,
  Play,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { dataService } from "../services/dataService.ts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LandingPage: React.FC = () => {
  const [demoDatasets, setDemoDatasets] = useState<any[]>([]);
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [loading, setLoading] = useState(true);
  console.log("demodatasets are :", demoDatasets);
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      const datasets = await dataService.getDatasetsLanding();
      setDemoDatasets(datasets); // Get last 3 demo datasets
    } catch (error) {
      console.error("Failed to load demo data:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Multiple Chart Types",
      description:
        "Line charts, bar charts, pie charts, scatter plots, and more",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Live data updates with smooth animations and transitions",
    },
    {
      icon: Database,
      title: "Data Management",
      description:
        "Upload CSV files, generate sample data, and organize datasets",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Share visualizations and collaborate with your team",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Charts Created", value: "50K+", icon: BarChart3 },
    { label: "Data Points", value: "1M+", icon: Activity },
    { label: "Uptime", value: "99.9%", icon: TrendingUp },
  ];

  const getDemoChartData = (dataset: any) => {
    // Return null or default data if dataset is invalid
    if (
      !dataset?.data ||
      !Array.isArray(dataset.data) ||
      dataset.data.length === 0
    ) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
      };
    }

    const colors = [
      "rgba(59, 130, 246, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
    ];

    if (dataset.type === "categorical") {
      return {
        labels: dataset.data.map((item: any) => item.category),
        datasets: [
          {
            data: dataset.data.map((item: any) => item.value),
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 2,
          },
        ],
      };
    }

    // Time series data
    const labels = dataset.data.map(
      (item: any) =>
        item.month || item.date || `Point ${dataset.data.indexOf(item) + 1}`
    );
    const keys = Object.keys(dataset.data[0] || {}).filter(
      (key) =>
        key !== "month" &&
        key !== "date" &&
        key !== "category" &&
        typeof dataset.data[0][key] === "number"
    );

    return {
      labels,
      datasets: keys.slice(0, 2).map((key, index) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: dataset.data.map((item: any) => item[key]),
        backgroundColor: colors[index],
        borderColor: colors[index].replace("0.8", "1"),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      })),
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "rgba(255, 255, 255, 0.8)", font: { size: 10 } },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.7)", font: { size: 10 } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "rgba(255, 255, 255, 0.7)", font: { size: 10 } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
    animation: { duration: 1000 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="glass-card border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BarChart3 size={32} className="text-primary-400" />
              <Sparkles
                size={16}
                className="absolute -top-1 -right-1 text-accent-400"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                FinSight
              </h1>
              <p className="text-sm text-gray-400">
                Delivering AI Powered Insights
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/Login"
              className="glass-button px-6 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Transform Your Data Into
                  <span className="gradient-text block">
                    Beautiful Insights
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Create stunning visualizations, analyze trends, and make
                  data-driven decisions with our professional analytics
                  platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/Login"
                  className="glass-button px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:scale-105 transition-all bg-primary-500/20 border-primary-500/50"
                >
                  <span className="text-lg font-semibold">
                    Get Started Free
                  </span>
                  <ArrowRight size={20} />
                </Link>
                <button className="glass-button px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:scale-105 transition-all">
                  <Play size={20} />
                  <span className="text-lg font-semibold">Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="text-center animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon
                        size={24}
                        className="mx-auto mb-2 text-primary-400"
                      />
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demo Visualization */}
            <div className="space-y-6 animate-slide-up">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Live Demo
                  </h3>
                  <div className="flex space-x-2">
                    {demoDatasets.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDemo(index)}
                        className={`w-3 h-3 rounded-full transition-all ${selectedDemo === index
                            ? "bg-primary-400"
                            : "bg-gray-600"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {!loading && demoDatasets[selectedDemo] && (
                  <div className="h-64">
                    {demoDatasets[selectedDemo].type === "categorical" ? (
                      <Pie
                        data={getDemoChartData(demoDatasets[selectedDemo])}
                        options={chartOptions}
                      />
                    ) : (
                      <Line
                        data={getDemoChartData(demoDatasets[selectedDemo])}
                        options={chartOptions}
                      />
                    )}
                  </div>
                )}

                {loading && (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-2">
                  Interactive charts with real data
                </p>
                <p className="text-sm text-gray-500">
                  {demoDatasets[selectedDemo]?.name || "Loading demo data..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need for professional data visualization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <Icon size={32} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Visualize Your Data?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who trust Data Visualizer Pro for
              their analytics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/Login"
                className="glass-button px-8 py-4 rounded-lg flex items-center justify-center space-x-2 hover:scale-105 transition-all bg-primary-500/20 border-primary-500/50"
              >
                <span className="text-lg font-semibold">Start Free Trial</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 size={24} className="text-primary-400" />
            <span className="text-lg font-semibold text-white">
              FinSight
            </span>
          </div>
          <p className="text-gray-400">
            © 2025 FinSight. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
