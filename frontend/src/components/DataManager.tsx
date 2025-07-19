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
  // Removed MoreVertical
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

  // Separate states for delete flow
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteDataset, setDeleteDataset] = useState<dataObject | null>(null);
  const [deleteConfirmationName, setDeleteConfirmationName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Consolidated dropdown state for export (since settings/delete are always visible)
  const [exportDropdownId, setExportDropdownId] = useState<number | null>(null);

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

  // Close dropdowns when clicking outside (only for export dropdown now)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the active export dropdown
      if (exportDropdownId !== null && event.target instanceof HTMLElement) {
        const dropdownElement = document.querySelector(`[data-export-dropdown-id="${exportDropdownId}"]`);
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setExportDropdownId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportDropdownId]);


  useEffect(() => {
    if (!hasDeleted && !hasUploaded && !hasUpdated) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      dispatch(setHasDeleted(false));
      dispatch(setHasUploaded(false));
      dispatch(setHasUpdated(false));
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
      dispatch(setHasUpdated(true));
      dispatch(setHasUpdatedData(true));
      onDatasetChange();
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

    if (file.type !== "text/csv") {
      toast.error("Please select a CSV file");
      return;
    }

    setIsUploading(true);
    try {
      await dataService.uploadCSV(file);
      toast.success("Dataset uploaded successfully!");
      dispatch(setHasUploaded(true));
      dispatch(setHasUpdatedData(true));
      onDatasetChange();
    } catch (error) {
      toast.error("Failed to upload dataset");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // ===== DELETE FLOW HANDLERS =====

  /**
   * Handles dataset deletion with confirmation
   * Step 1: Show initial delete warning
   */
  const handleDeleteDataset = (id: number, name: string) => {
    setDeleteDataset({ id, name });
    setShowDeleteWarning(true);
    setExportDropdownId(null); // Close export dropdown
  };

  /**
   * User confirms they want to delete, show name confirmation
   * Step 2: User confirms they want to delete, show name confirmation
   */
  const handleConfirmDelete = () => {
    setShowDeleteWarning(false);
    setShowDeleteConfirmation(true);
    setDeleteConfirmationName("");
  };

  /**
   * Confirms and executes dataset deletion
   * Step 3: User types name and confirms final deletion
   */
  const handleFinalDelete = async () => {
    if (!deleteDataset) return;

    if (deleteConfirmationName !== deleteDataset.name) {
      toast.error(
        "Dataset name does not match. Please type the exact name to confirm deletion."
      );
      return;
    }

    setIsDeleting(true);
    try {
      await dataService.deleteDataset(deleteDataset.id);
      toast.success("Dataset deleted successfully");
      dispatch(setHasDeleted(true));
      dispatch(setHasUpdatedData(true));
      onDatasetChange();
      handleCancelDelete();
    } catch (error) {
      toast.error("Failed to delete dataset");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Cancels dataset deletion
   * Cancel delete flow at any point
   */
  const handleCancelDelete = () => {
    setShowDeleteWarning(false);
    setShowDeleteConfirmation(false);
    setDeleteDataset(null);
    setDeleteConfirmationName("");
  };

  /**
   * Exports dataset in specified format
   */
  const exportDataset = async (dataset: Dataset, format: "csv" | "json") => {
    setExportDropdownId(null); // Close dropdown after selection
    try {
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

      let content = "";
      let mimeType = "";
      let extension = "";

      if (format === "csv") {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(","),
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
   * Renders delete warning modal (Step 1)
   */
  const renderDeleteWarningModal = () =>
    showDeleteWarning &&
    deleteDataset && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glass-card p-6 max-w-md w-full mx-auto animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Delete Dataset
              </h3>
            </div>
            <button
              onClick={handleCancelDelete}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to delete the dataset{" "}
              <strong>"{deleteDataset.name}"</strong>?
            </p>
            <p className="text-sm text-red-400">
              This action cannot be undone. All data will be permanently
              removed.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
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
   * Renders delete confirmation modal (Step 2)
   */
  const renderDeleteConfirmationModal = () =>
    showDeleteConfirmation &&
    deleteDataset && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glass-card p-6 max-w-md w-full mx-auto animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Confirm Deletion
              </h3>
            </div>
            <button
              onClick={handleCancelDelete}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              disabled={isDeleting}
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              To confirm deletion, please type the dataset name:
            </p>
            <p className="text-sm font-mono bg-gray-800/50 p-2 rounded border text-white break-all">
              {deleteDataset.name}
            </p>

            <input
              type="text"
              value={deleteConfirmationName}
              onChange={(e) => setDeleteConfirmationName(e.target.value)}
              placeholder="Type dataset name here"
              className="w-full px-3 py-2 glass-card border border-white/20 rounded-lg focus:outline-none focus:border-red-400 text-white"
              disabled={isDeleting}
              autoFocus
            />

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleFinalDelete}
                disabled={
                  deleteConfirmationName !== deleteDataset.name || isDeleting
                }
                className="flex-1 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 glass-button px-4 py-2 rounded-lg"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  /**
   * Renders the dataset settings modal
   */
  const renderSettingsModal = () =>
    showSettings &&
    selectedDataset && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glass-card p-6 max-w-lg w-full mx-auto animate-scale-in">
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

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => handleChangeName(datasetName)}
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
  let attribute;
  let attribute2;
  let attribute3;
  let attribute4;
  if(window.innerWidth < 768) 
  {
    attribute="flex-col items-start justify-center"
    attribute2="flex-col items-start"
    attribute3="w-[85vw]"
    attribute4="w-[85vw]"
  }
  else
  {
    attribute="items-center space-x-4"
    attribute2="flex-wrap items-center"
    attribute3="p-4 sm:p-6"
    attribute4=""
  }

  

  const renderDatasetItem = (dataset: Dataset) => (
    <div
      key={dataset.id}
      className="glass-card p-4 hover:bg-white/10 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
    >
      <div className={`flex ${attribute} mb-4 sm:mb-0 flex-grow`}>
        <div className="p-2 bg-primary-500/20 rounded-lg flex-shrink-0">
          <FileText size={20} className="text-primary-400" />
        </div>

        <div className="flex flex-col">
          <h3 className="font-medium text-white lg:text-lg sm:text-sm">{dataset.name}</h3>
          <div className={`flex ${attribute2} gap-x-4 gap-y-1 text-sm text-gray-400 mt-1`}> {/* Increased gap-x, added gap-y */}
            <span>
              {window.innerWidth<=768 && <span>•</span>}{dataset.dataPoints || dataset.data?.length || 0} points
            </span>
            {window.innerWidth>768 && <span>•</span>}
            <span>
              {window.innerWidth<=768 && <span>•</span>}
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
            </span>
            
            {window.innerWidth>768 && <span>•</span>}
            <span>{window.innerWidth<=768 && <span>•</span>}{new Date(dataset.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Always visible, now using flex-wrap */}
      <div className="flex flex-wrap gap-2 justify-end sm:justify-start"> {/* Use flex-wrap, adjust alignment */}
        {/* Export Dropdown Button */}
        <div className="relative" data-export-dropdown-id={dataset.id}> {/* Used for click outside logic */}
          <button
            onClick={() => {
              setExportDropdownId(exportDropdownId === dataset.id ? null : dataset.id);
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-gray-400 hover:text-white"
          >
            <Download size={16} />
            <span className="sr-only sm:not-sr-only">Export</span> {/* Show text on desktop, screen reader only on mobile */}
          </button>

          {exportDropdownId === dataset.id && (
            <div className="absolute bottom-8 left-0 sm:left-0 w-40 glass-card p-2 rounded-lg z-10 flex space-y-1 gap-5">
              <button
                onClick={() => exportDataset(dataset, "csv")}
                className="w-full px-2 py-1 hover:bg-white/10 rounded text-sm text-gray-300"
              >
                1.Export CSV
              </button>
              <button
                onClick={() => exportDataset(dataset, "json")}
                className="w-full px-2 py-1 hover:bg-white/10 rounded text-sm text-gray-300"
              >
                2.Export JSON
              </button>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => {
            setSelectedDataset(dataset);
            setShowSettings(true);
            setExportDropdownId(null); // Close export dropdown
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-gray-400 hover:text-white"
        >
          <Settings size={16} />
          <span className="sr-only sm:not-sr-only">Settings</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteDataset(dataset.id, dataset.name)}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1 text-red-400 hover:text-red-300"
        >
          <Trash2 size={16} />
          <span className="sr-only sm:not-sr-only">Delete</span>
        </button>
      </div>
    </div>
  );

  /**
   * Renders empty state when no datasets exist
   */
  const renderEmptyState = () => (
    <div className="text-center py-12 px-4 sm:px-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center">
        <FileText size={24} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No datasets yet</h3>
      <p className="text-gray-400 mb-6">
        Upload a CSV file or generate sample data to get started
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setShowGenerator(true)}
          className="glass-button px-6 py-3 rounded-lg flex items-center justify-center space-x-2"
        >
          <Zap size={16} />
          <span>Generate Sample</span>
        </button>
        <label className="glass-button px-6 py-3 rounded-lg flex items-center justify-center space-x-2 cursor-pointer">
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
    <div className="p-4 sm:p-6 bg-zinc-900 min-h-screen">
      <DataWarningModal
        isOpen={true}
        onClose={() => setShowWarning(false)}
        onAcknowledge={() => setShowWarning(false)}
        deleteDataset={null}
        showDelete={false}
        onDatasetChange={onDatasetChange}
        deleteConfirmationName={deleteConfirmationName}
        setDeleteConfirmationName={setDeleteConfirmationName}
        confirmDeleteDataset={() => {}}
        cancelDeleteDataset={() => {}}
      />
    </div>
  ) : (
    <div className={`${attribute3} space-y-6 animate-fade-in lg:p-8`}>
      {/* Header Section */}
       <div className="flex items-center justify-between">
          <div>
           <h1 className="text-2xl font-bold text-white mb-2">Data Manager</h1>
           <p className="text-gray-400">
             Upload, manage, and organize your datasets
           </p>
         </div>

         <div className={`${attribute4} flex space-x-3`}>
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
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
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

        <div className="space-y-4">
          {datasets.length > 0
            ? datasets.map(renderDatasetItem)
            : renderEmptyState()}
        </div>
      </div>

      {/* Modals */}
      {renderSettingsModal()}
      {renderDeleteWarningModal()}
      {renderDeleteConfirmationModal()}
    </div>
  );
};

export default DataManager;