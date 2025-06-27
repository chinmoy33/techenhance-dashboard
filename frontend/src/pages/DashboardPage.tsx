import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/Dashboard";
import ChartView from "../components/ChartView";
import DataManager from "../components/DataManager";
import { Dataset } from "../types";
import { dataService } from "../services/dataService";
import Recommendations from "../components/Recommendations";
import Searchcustomerpage from "./Searchcustomerpage";
import { DatabaseRecord } from "../types/searchcustomerpage";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "charts" | "allCharts" | "data" | "recommendations" | "searchcustomerpage"
  >("dashboard");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>("line");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDatasets();
      setDatasets(data);
      console.log("Loaded datasets:", data);

      // Auto-select first dataset if none selected
      if (!selectedDataset && data.length > 0) {
        const firstDataset = await dataService.getDataset(data[0].id);
        setSelectedDataset(firstDataset);
      }
    } catch (error) {
      console.error("Failed to load datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetSelect = async (datasetId: number) => {
    try {
      const dataset = await dataService.getDataset(datasetId);
      setSelectedDataset(dataset);
      setCurrentView("charts");
    } catch (error) {
      console.error("Failed to load dataset:", error);
    }
  };

  const handleChartSelect = (chartType: string) => {
    setSelectedChartType(chartType);
    setCurrentView("charts");
  };

  const handleViewChange = (
    view: "dashboard" | "charts" | "allCharts" | "data" 
  ) => {
    setCurrentView(view);

    // If switching to allCharts and no dataset selected, select first available
    if (view === "allCharts" && !selectedDataset && datasets.length > 0) {
      handleDatasetSelect(datasets[0].id);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            datasets={datasets}
            onDatasetSelect={handleDatasetSelect}
          />
        );

      case "charts":
        return selectedDataset ? (
          <ChartView
            dataset={selectedDataset}
            initialChartType={selectedChartType as any}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Please select a dataset to visualize
              </p>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="glass-button px-6 py-3 rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      case "allCharts":
        return selectedDataset ? (
          <ChartView
            dataset={selectedDataset}
            showAllCharts={true}
            onChartSelect={handleChartSelect}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Please select a dataset to view all charts
              </p>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="glass-button px-6 py-3 rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );

      case "data":
        return (
          <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
        );

      case "recommendations":
        return <Recommendations />;

      case "searchcustomerpage":
  const records: DatabaseRecord[] = datasets.flatMap((dataset) =>
    dataset.data.map((entry, index) => ({
      id: Number(`${dataset.id}${index}`),
      name: dataset.name,
      data: entry,
      type: dataset.name.toLowerCase().includes("transaction") ? "transaction" : "profile",
      createdAt: dataset.createdAt,
      updatedAt: dataset.updatedAt || dataset.createdAt,
    }))
  );
  return <Searchcustomerpage records={records} />;



      default:
        return (
          <DashboardView
            datasets={datasets}
            onDatasetSelect={handleDatasetSelect}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mb-4">
        <Header />
      </div>
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={renderContent()} />
              <Route path="/*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
