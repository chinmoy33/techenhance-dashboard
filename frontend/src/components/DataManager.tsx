import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Trash2,
  Download,
  FileText,
  Zap,
  X,
  Settings,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Dataset } from "../types";
import { dataService } from "../services/dataService";
import DataWarningModal from "./DataWarningModal";
import { RootState } from "../store";
import {
  setHasDeleted,
  setHasUploaded,
  setHasUpdated,
} from "../store/warningSlice";
import { setHasUpdatedData } from "../store/refetchDataSlice";

interface DataManagerProps {
  datasets: Dataset[];
  onDatasetChange: () => void;
}

interface dataObject {
  id: number | null;
  name: string;
}

const DataManager: React.FC<DataManagerProps> = ({
  datasets,
  onDatasetChange,
}) => {
  // ===== STATE MANAGEMENT =====
  const [isUploading, setIsUploading] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [exportDropdownId, setExportDropdownId] = useState<number | null>(null);
  const [deleteDataset, setDeleteDataset] = useState<dataObject | null>(null);
  // const [deleteConfirmationName, setDeleteConfirmationName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const hasDeleted = useSelector(
    (state: RootState) => state.warning.hasDeleted
  );
  const hasUploaded = useSelector(
    (state: RootState) => state.warning.hasUploaded
  );
  const hasUpdated = useSelector(
    (state: RootState) => state.warning.hasUpdated
  );
  const [datasetName, setDatasetName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = useState("");

  useEffect(() => {
    if (!hasDeleted && !hasUploaded && !hasUpdated) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      dispatch(setHasDeleted(false)); // Reset after showing warning
      dispatch(setHasUploaded(false)); // Reset after showing warning
      dispatch(setHasUpdated(false)); // Reset after showing warning
    }
  }, []);

  useEffect(() => {
    if (selectedDataset) {
      setDatasetName(selectedDataset.name);
    }
  }, [selectedDataset]);

  // ===== EVENT HANDLERS =====

  const handleChangeName = async (datasetname: string) => {
    setIsUpdating(true);
    try {
      await dataService.updateDatasetName(selectedDataset?.id, datasetname);
      toast.success("Dataset name updated successfully!");
      dispatch(setHasUpdated(true)); // Set updated state
      dispatch(setHasUpdatedData(true)); // Set updated state
      onDatasetChange(); // Refresh dataset list
    } catch (error) {
      toast.error("Failed to update dataset");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
      setShowSettings(false);
      setSelectedDataset(null);
    }
  };

  /**
   * Handles file upload from input element
   * Validates file type and uploads to backend
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "text/csv") {
      toast.error("Please select a CSV file");
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to backend
      await dataService.uploadCSV(file);
      toast.success("Dataset uploaded successfully!");
      dispatch(setHasUploaded(true)); // Set uploaded state
      dispatch(setHasUpdatedData(true)); // Set updated state
      onDatasetChange(); // Refresh dataset list
    } catch (error) {
      toast.error("Failed to upload dataset");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Clear input
    }
  };

  /**
   * Handles dataset deletion with confirmation
   */
  // const handleDeleteDataset = async (id: number, name: string) => {
  //   // Show confirmation dialog
  //   setShowDelete(true);
  //   setDeleteDataset({ id, name });
  //   console.log("Delete dataset with id:", id);
  // };

  const handleDeleteDataset = (id: number, name: string) => {
    setShowDelete(true);
    setDeleteDataset({ id, name });
    setDeleteConfirmationName(""); // Reset confirmation input
  };
  /**
   * Confirms and executes dataset deletion
   */
  const confirmDeleteDataset = async () => {
    if (!deleteDataset) return;

    if (deleteConfirmationName !== deleteDataset.name) {
      toast.error(
        "Dataset name does not match. Please type the exact name to confirm deletion."
      );
      return;
    }

    try {
      await dataService.deleteDataset(deleteDataset.id);
      toast.success("Dataset deleted successfully");
      dispatch(setHasDeleted(true));
      dispatch(setHasUpdatedData(true));
      onDatasetChange();
      setShowDelete(false);
      setDeleteDataset(null);
      setDeleteConfirmationName("");
    } catch (error) {
      toast.error("Failed to delete dataset");
      console.error("Delete error:", error);
    }
  };

  /**
   * Cancels dataset deletion
   */
  const cancelDeleteDataset = () => {
    setShowDelete(false);
    setDeleteDataset(null);
    setDeleteConfirmationName("");
  };
  /**
   * Exports dataset in specified format
   */
  // const exportDataset = (dataset: Dataset, format: "csv" | "json") => {
  //   try {
  //     let content = "";
  //     let mimeType = "";
  //     let extension = "";

  //     if (format === "csv") {
  //       // Generate CSV content
  //       const headers = Object.keys(dataset.data[0] || {});
  //       const csvContent = [
  //         headers.join(","), // Header row
  //         ...dataset.data.map((row) =>
  //           headers
  //             .map((header) =>
  //               // Escape commas in string values
  //               typeof row[header] === "string" && row[header].includes(",")
  //                 ? `"${row[header]}"`
  //                 : row[header]
  //             )
  //             .join(",")
  //         ),
  //       ].join("\n");

  //       content = csvContent;
  //       mimeType = "text/csv";
  //       extension = "csv";
  //     } else {
  //       // Generate JSON content
  //       content = JSON.stringify(dataset.data, null, 2);
  //       mimeType = "application/json";
  //       extension = "json";
  //     }

  //     // Create and trigger download
  //     const blob = new Blob([content], { type: mimeType });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${dataset.name}.${extension}`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);

  //     toast.success(`Dataset exported as ${format.toUpperCase()}`);
  //   } catch (error) {
  //     toast.error("Failed to export dataset");
  //     console.error("Export error:", error);
  //   }
  // };
  const exportDataset = async (dataset: Dataset, format: "csv" | "json") => {
    try {
      // Step 1: Fetch full dataset if data is missing
      let fullDataset = dataset;

      if (!Array.isArray(dataset.data) || dataset.data.length === 0) {
        const toastId = toast.loading("Fetching full dataset before export...");
        fullDataset = await dataService.getDataset(dataset.id);
        toast.dismiss(toastId);
      }

      const data = fullDataset.data;

      if (!Array.isArray(data) || data.length === 0) {
        toast.error("Dataset is empty or failed to load.");
        return;
      }

      // Step 2: Format content
      let content = "";
      let mimeType = "";
      let extension = "";

      if (format === "csv") {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(","), // Header row
          ...data.map((row) =>
            headers
              .map((header) =>
                typeof row[header] === "string" && row[header].includes(",")
                  ? `"${row[header]}"`
                  : row[header]
              )
              .join(",")
          ),
        ].join("\n");

        content = csvContent;
        mimeType = "text/csv";
        extension = "csv";
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        extension = "json";
      }

      // Step 3: Trigger file download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataset.name}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Dataset exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export dataset");
      console.error("Export error:", error);
    }
  };

  // ===== RENDER COMPONENTS =====
  /**
   * Renders the dataset settings modal
   */

  const renderSettingsModal = () =>
    showSettings &&
    selectedDataset && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="glass-card p-6 max-w-lg w-full mx-4 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Dataset Settings
            </h3>
            <button
              onClick={() => {
                setShowSettings(false);
                setSelectedDataset(null);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dataset Name
              </label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white"
                placeholder="Enter dataset name"
                disabled={isUpdating}
              />
            </div>

            {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Dataset Type</label>
            <select className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 text-white">
              <option value="time_series">Time Series</option>
              <option value="categorical">Categorical</option>
              <option value="distribution">Distribution</option>
              <option value="generic">Generic</option>
            </select>
          </div> */}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  handleChangeName(datasetName);
                }}
                className="flex-1 glass-button px-4 py-2 rounded-lg bg-primary-500/20 border-primary-500/50"
              >
                <span>{isUpdating ? "Updating..." : "Save Changes"}</span>
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setSelectedDataset(null);
                }}
                className="flex-1 glass-button px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  /**
   * Renders individual dataset item
   */
  const renderDatasetItem = (dataset: Dataset) => (
    <div
      key={dataset.id}
      className="glass-card p-4 hover:bg-white/10 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        {/* Dataset Info */}
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <FileText size={20} className="text-primary-400" />
          </div>

          <div>
            <h3 className="font-medium text-white">{dataset.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <span>
                {dataset.dataPoints || dataset.data?.length || 0} points
              </span>
              <span>•</span>
              {/* Dataset Type Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  dataset.type === "time_series"
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
              <span>•</span>
              <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Export Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => {
                if (exportDropdownId === dataset.id) {
                  setExportDropdownId(null); // close if already open
                } else {
                  setExportDropdownId(dataset.id); // open for current
                  setShowSettings(false); // close settings if open
                  setSelectedDataset(dataset);
                }
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download size={16} className="text-gray-400 hover:text-white" />
            </button>

            {exportDropdownId === dataset.id && (
              <div className="absolute right-0 top-full mt-2 w-60 glass-card p-2 rounded-lg z-10 flex">
                <button
                  onClick={() => exportDataset(dataset, "csv")}
                  className="w-full text-left px-2 py-1 hover:bg-white/10 rounded text-sm text-gray-300"
                >
                  1. Export CSV
                </button>
                <button
                  onClick={() => {
                    exportDataset(dataset, "json");
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-white/10 rounded text-sm text-gray-300"
                >
                  2. Export JSON
                </button>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => {
              if (showSettings && selectedDataset?.id === dataset.id) {
                setShowSettings(false);
                setSelectedDataset(null);
              } else {
                setExportDropdownId(null); // close dropdown if open
                setSelectedDataset(dataset);
                setShowSettings(true);
              }
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings size={16} className="text-gray-400 hover:text-white" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteDataset(dataset.id, dataset.name)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-red-400 hover:text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Renders empty state when no datasets exist
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center">
        <FileText size={24} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No datasets yet</h3>
      <p className="text-gray-400 mb-6">
        Upload a CSV file or generate sample data to get started
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowGenerator(true)}
          className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Zap size={16} />
          <span>Generate Sample</span>
        </button>
        <label className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer">
          <FileText size={16} />
          <span>Upload CSV</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return showWarning ? (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <DataWarningModal
        isOpen={true}
        onClose={() => setShowWarning(false)}
        onAcknowledge={() => setShowWarning(false)}
        deleteDataset={null}
        showDelete={false}
        onDatasetChange={onDatasetChange}
        deleteConfirmationName={deleteConfirmationName}
        setDeleteConfirmationName={setDeleteConfirmationName}
        confirmDeleteDataset={confirmDeleteDataset}
        cancelDeleteDataset={cancelDeleteDataset}
      />
    </div>
  ) : !showDelete ? (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Data Manager</h1>
          <p className="text-gray-400">
            Upload, manage, and organize your datasets
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {/* <button
          onClick={() => setShowGenerator(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform"
        >
          <Zap size={16} />
          <span>Generate Data</span>
        </button> */}

          <label className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform">
            <FileText size={16} />
            <span>{isUploading ? "Uploading..." : "Upload CSV"}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Datasets List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Datasets</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {datasets.length} datasets
            </span>
            <button
              onClick={onDatasetChange}
              className="glass-button px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
            >
              <RotateCcw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Dataset Items or Empty State */}
        <div className="space-y-4">
          {datasets.length > 0
            ? datasets.map(renderDatasetItem)
            : renderEmptyState()}
        </div>
      </div>

      {/* Modals */}
      {renderSettingsModal()}
    </div>
  ) : (
    <DataWarningModal
      isOpen={true}
      // onClose={() => setShowDelete(false)}
      // onAcknowledge={() => setShowDelete(false)}
      onClose={cancelDeleteDataset}
      onAcknowledge={confirmDeleteDataset}
      deleteDataset={deleteDataset}
      showDelete={showDelete}
      onDatasetChange={onDatasetChange}
      deleteConfirmationName={deleteConfirmationName}
      setDeleteConfirmationName={setDeleteConfirmationName}
      confirmDeleteDataset={confirmDeleteDataset}
      cancelDeleteDataset={cancelDeleteDataset}
    />
  );
};

export default DataManager;
