import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/Dashboard";
import ChartView from "../components/ChartView/ChartView";
import DataManager from "../components/DataManager";
import AccountSettings from "../components/AccountSettings";
import { Dataset } from "../types";
import { dataService } from "../services/dataService";
import Recommendations from "../components/Recommendations";
import Searchcustomerpage from "./Searchcustomerpage";
import { DatabaseRecord } from "../types/searchcustomerpage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store"; // Adjust import
import { setMenu } from "../store/uiSlice";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "charts"
    | "allCharts"
    | "data"
    | "recommendations"
    | "searchcustomerpage"
    | "account"
  >("dashboard");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>("line");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isMenuClicked = useSelector((state: RootState) => state.ui.isMenuClicked);
  const [isTablet,setIsTablet] = useState(false);

  useEffect(() => {
  const checkResponsive = () => {
    const width = window.innerWidth;
    console.log("Viewport width:", width); // Add this
    setIsMobile(width <= 768);
    setIsTablet(width > 768 && width <= 1536);
  };

  checkResponsive(); // Initial check

  window.addEventListener("resize", checkResponsive);

  return () => window.removeEventListener("resize", checkResponsive);
}, []);

  useEffect(() => {
    loadDatasets();
  }, []);

  useEffect(() => {
    if (currentView === "searchcustomerpage") {
      loadFullDatasetsIfNeeded();
    }
  }, [currentView]);

  const loadFullDatasetsIfNeeded = async () => {
    const incomplete = datasets.filter((d) => !Array.isArray(d.data));
    if (incomplete.length === 0) return;

    const fullDatasets = await Promise.all(
      incomplete.map((d) => dataService.getDataset(d.id))
    );

    // Replace existing dataset with full versions
    setDatasets((prev) => {
      const map = new Map(prev.map((d) => [d.id, d]));

      for (const full of fullDatasets) {
        const old = map.get(full.id);
        map.set(full.id, {
          ...old,
          ...full,
          dataPoints: Array.isArray(full.data)
            ? full.data.length
            : old?.dataPoints || 0,
        });
      }

      const updated = Array.from(map.values());
      console.log("datasets after loading full data:", updated); // ✅ correct
      return updated;
    });
  };

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
    view: "dashboard" | "charts" | "allCharts" | "data" | "account"
  ) => {
    setCurrentView(view);

    // If switching to allCharts and no dataset selected, select first available
    if (view === "allCharts" && !selectedDataset && datasets.length > 0) {
      handleDatasetSelect(datasets[0].id);
    }
  };
  console.log("datasets in Dashboard:", datasets);
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

      case "account":
        return <AccountSettings />;

      case "recommendations":
        return <Recommendations />;

      case "searchcustomerpage":
        const allHaveData = datasets.every((ds) => Array.isArray(ds.data));

        if (!allHaveData) {
          return (
            <div className="flex flex-col items-center justify-center py-52">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-gray-300">
                Loading Full Dataset for Search...
              </p>
            </div>
          );
        }

        const records: DatabaseRecord[] = datasets.flatMap((dataset) =>
          dataset.data.map((entry, index) => ({
            id: Number(`${dataset.id}${index}`),
            name: dataset.name,
            data: entry,
            type: dataset.name.toLowerCase().includes("transaction")
              ? "transaction"
              : "profile",
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
        {/* <Header /> */}
        <Header isMobile={isMobile} />
      </div>
      <div className="flex flex-1">
        {/* <Sidebar currentView={currentView} onViewChange={handleViewChange} /> */}
        {(isMobile && isMenuClicked) ? (
          <div className="fixed z-50 w-[80%] h-full bg-background shadow-lg transition-all duration-300 ease-in-out overflow-auto">
            <Sidebar currentView={currentView} onViewChange={handleViewChange} isTablet={isTablet}/>
          </div>
        ) : !isMobile ? (
          <Sidebar currentView={currentView} onViewChange={handleViewChange} isTablet={isTablet}/>
        ) : null}
        
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
