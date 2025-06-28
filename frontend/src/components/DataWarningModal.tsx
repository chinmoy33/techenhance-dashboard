import React from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import {dataService} from "../services/dataService"; // Adjust the import path as necessary
import { useDispatch} from "react-redux";
//import { RootState } from "../store"; // Adjust the import path as necessary
import {setHasDeleted} from "../store/warningSlice"; // Adjust the import path as necessary

interface DataWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  deleteDataset: { id: number | null; name: string } | null;
  showDelete: boolean;
  onDatasetChange: () => void;
}

export const DataWarningModal: React.FC<DataWarningModalProps> = ({
  isOpen,
  onClose,
  onAcknowledge,
  deleteDataset=null,
  showDelete=false,
  onDatasetChange,
}) => {
  const dispatch = useDispatch();
  //const hasDeleted = useSelector((state : RootState) => state.warning.hasDeleted);
  if (!isOpen) return null;

  const onDelete = async() => {
    console.log("Delete dataset with id: and name", deleteDataset?.id, deleteDataset?.name);
    try {
      await dataService.deleteDataset(deleteDataset?.id);
      dispatch(setHasDeleted(true));
      toast.success("Dataset deleted successfully");
      onDatasetChange(); // Refresh dataset list
    } catch (error) {
      toast.error("Failed to delete dataset");
      console.error("Delete error:", error);
    }
    finally{
        onAcknowledge();
    }
    
  }

  return !showDelete ? (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <AlertTriangle className="text-yellow-400 h-6 w-6" />
          <h2 className="text-xl font-semibold text-white">Be Careful !</h2>
        </div>
        <p className="text-gray-300 mb-6">
          If you delete any data in the <span className="text-blue-400 font-medium">Data Manager</span>,
          it will be <span className="text-red-500 font-semibold">permanently removed</span> from the database.
          There is <span className="text-red-500 font-semibold">no way to recover</span> it unless you re-upload the original
          CSV file.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onAcknowledge}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  ):
  (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <AlertTriangle className="text-yellow-400 h-6 w-6" />
          <h2 className="text-xl font-semibold text-white">Data Deletion Warning</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the dataset <span className="text-blue-400 font-medium">{deleteDataset?.name}</span>?<br/><br/>
          Note : If you delete any data in the <span className="text-blue-400 font-medium">Data Manager</span>,
          it will be <span className="text-red-500 font-semibold">permanently removed</span> from the database.
          There is <span className="text-red-500 font-semibold">no way to recover</span> it unless you re-upload the original
          CSV file.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataWarningModal;
