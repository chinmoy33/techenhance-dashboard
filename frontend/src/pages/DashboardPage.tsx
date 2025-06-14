// import React, { useState, useEffect } from "react";
// import { Toaster } from "react-hot-toast";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Dashboard from "../components/Dashboard";
// import ChartView from "../components/ChartView";
// import DataManager from "../components/DataManager";
// import Recommendations from "../components/Recommendations.tsx";
// import { Dataset } from "../types";
// import { dataService } from "../services/dataService";
// import { Route, Routes} from "react-router-dom";
// //import ProtectedRoute from "./components/ProtectedRoute.tsx";
// //import Login from "./components/Login.tsx";
// //import LandingPage from "./pages/LandingPage.tsx";
// //import AuthPage from "./pages/AuthPage.tsx";
// import { supabase } from "../supabaseClient.ts";
// import { useNavigate } from "react-router-dom";
// //import OAuthCallback from "./components/OAuthCallback.tsx";

// function DashboardPage() {
//   const navigate = useNavigate();
//   // State for current view: dashboard, charts, or data manager
//   const [currentView, setCurrentView] = useState<
//     "dashboard" | "charts" | "data" | "recommendations"
//   >("dashboard");
//   // State for all datasets
//   const [datasets, setDatasets] = useState<Dataset[]>([]);
//   // State for the currently selected dataset
//   const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
//   // State for loading indicator
//   const [loading, setLoading] = useState(true);
// //   useEffect(() => {
// //   const url = new URL(window.location.href);
// //   const code = url.searchParams.get("code");

// //   if (code) {
// //     supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
// //       if (error) {
// //         console.error("Failed to exchange code:", error);
// //       } else {
// //         console.log("Exchanged session:", data.session);
// //         // ✅ Session will now be stored in localStorage
// //       }
// //     });
// //   }
// // }, []);

//   // Load datasets on initial mount
//   useEffect(() => {
//     loadDatasets();
//   }, []);

//   // Fetch all datasets from the data service
//   const loadDatasets = async () => {
//     try {
//       setLoading(true);
//       const data = await dataService.getDatasets();
//       setDatasets(data);
//     } catch (error) {
//       console.error("Failed to load datasets:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle selection of a dataset and switch to chart view
//   const handleDatasetSelect = async (datasetId: string) => {
//     try {
//       const dataset = await dataService.getDataset(datasetId);
//       setSelectedDataset(dataset);
//       setCurrentView("charts");
//     } catch (error) {
//       console.error("Failed to load dataset:", error);
//     }
//   };
//   useEffect(()=>{
//     renderContent();
//   },[currentView]);

//   //Render content based on the current view
//   const renderContent = () => {
//     switch (currentView) {
//       case 'dashboard':
//         return <Dashboard datasets={datasets} onDatasetSelect={handleDatasetSelect} />;
//       case 'charts':
//         return selectedDataset ? (
//           <ChartView dataset={selectedDataset} />
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <p className="text-gray-400">Please select a dataset to visualize</p>
//           </div>
//         );
//       case 'data':
//         return <DataManager datasets={datasets} onDatasetChange={loadDatasets} />;
//       default:
//         return <Dashboard datasets={datasets} onDatasetSelect={handleDatasetSelect} />;
//     }
//   };

//   // Show loading spinner while fetching data
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
//       </div>
//     );
//   }

//   // Main app layout with header, sidebar, main content, and toaster notifications
//   //  return (
//   //     <div className="min-h-screen flex flex-col">
//   //       <div className="flex flex-1">
//   //         <Sidebar currentView={currentView} onViewChange={setCurrentView} />
//   //         <main className="flex-1 p-6 overflow-auto">
//   //           <Routes>
//   //             <Route
//   //               path="/Dashboard"
//   //               element={
//   //                 <ProtectedRoute>
//   //                   <Dashboard
//   //                     datasets={datasets}
//   //                     onDatasetSelect={handleDatasetSelect}
//   //                   />
//   //                 </ProtectedRoute>
//   //               }
//   //             />
//   //             <Route path="/" element={<LandingPage />} />
//   //             <Route path="/Login" element={<AuthPage />} />
//   //             {/* <Route path="/Login" element={<AuthPage />} /> */}

//   //             <Route
//   //               path="/charts"
//   //               element={
//   //                 <ProtectedRoute>
//   //                   {selectedDataset ? (
//   //                     <ChartView dataset={selectedDataset} />
//   //                   ) : (
//   //                     <div className="flex items-center justify-center h-64">
//   //                       <p className="text-gray-400">
//   //                       Please select a dataset to visualize
//   //                       </p>
//   //                     </div>
//   //                   )}
//   //                 </ProtectedRoute>
//   //               }
//   //             />
//   //             <Route
//   //               path="/data"
//   //               element={
//   //                 <ProtectedRoute>
//   //                   <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
//   //                 </ProtectedRoute>
//   //               }
//   //             />
//   //             <Route
//   //               path="/recommendations"
//   //               element={
//   //                 <ProtectedRoute>
//   //                   <Recommendations />
//   //                 </ProtectedRoute>
//   //               }
//   //             />
//   //           </Routes>
//   //         </main>
//   //       </div>
//   //       <Toaster
//   //       position="top-right"
//   //       toastOptions={{
//   //         style: {
//   //           background: "rgba(255, 255, 255, 0.1)",
//   //           color: "#fff",
//   //           backdropFilter: "blur(10px)",
//   //           border: "1px solid rgba(255, 255, 255, 0.2)",
//   //         },
//   //       }}
//   //     />
//   //     </div>
//   // );

//   return (
//     <div className="min-h-screen">
//       <Routes>
//               <Route
//                 path="/Dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <Dashboard
//                       datasets={datasets}
//                       onDatasetSelect={handleDatasetSelect}
//                     />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="/" element={<LandingPage />} />
//               <Route path="/Login" element={<AuthPage />} />
//               <Route path="/auth/callback" element={<OAuthCallback />} />
//               {/* <Route path="/Login" element={<AuthPage />} /> */}

//               <Route
//                 path="/charts"
//                 element={
//                   <ProtectedRoute>
//                     {selectedDataset ? (
//                       <ChartView dataset={selectedDataset} />
//                     ) : (
//                       <div className="flex items-center justify-center h-64">
//                         <p className="text-gray-400">
//                         Please select a dataset to visualize
//                         </p>
//                       </div>
//                     )}
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/data"
//                 element={
//                   <ProtectedRoute>
//                     <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/recommendations"
//                 element={
//                   <ProtectedRoute>
//                     <Recommendations />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//                 <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: "rgba(255, 255, 255, 0.1)",
//             color: "#fff",
//             backdropFilter: "blur(10px)",
//             border: "1px solid rgba(255, 255, 255, 0.2)",
//           },
//         }}
//       />
//     </div>

//       // <div className="min-h-screen flex flex-col">
//       //   <div className="flex flex-1">
//       //     <Sidebar currentView={currentView} onViewChange={setCurrentView} />
//       //     <main className="flex-1 p-6 overflow-auto">
//       //       <Routes>
//       //         <Route
//       //           path="/Dashboard"
//       //           element={
//       //             <ProtectedRoute>
//       //               <Dashboard
//       //                 datasets={datasets}
//       //                 onDatasetSelect={handleDatasetSelect}
//       //               />
//       //             </ProtectedRoute>
//       //           }
//       //         />
//       //         <Route path="/" element={<LandingPage />} />
//       //         <Route path="/Login" element={<AuthPage />} />
//       //         {/* <Route path="/Login" element={<AuthPage />} /> */}

//       //         <Route
//       //           path="/charts"
//       //           element={
//       //             <ProtectedRoute>
//       //               {selectedDataset ? (
//       //                 <ChartView dataset={selectedDataset} />
//       //               ) : (
//       //                 <div className="flex items-center justify-center h-64">
//       //                   <p className="text-gray-400">
//       //                   Please select a dataset to visualize
//       //                   </p>
//       //                 </div>
//       //               )}
//       //             </ProtectedRoute>
//       //           }
//       //         />
//       //         <Route
//       //           path="/data"
//       //           element={
//       //             <ProtectedRoute>
//       //               <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
//       //             </ProtectedRoute>
//       //           }
//       //         />
//       //         <Route
//       //           path="/recommendations"
//       //           element={
//       //             <ProtectedRoute>
//       //               <Recommendations />
//       //             </ProtectedRoute>
//       //           }
//       //         />
//       //       </Routes>
//       //     </main>
//       //   </div>
//       //   <Toaster
//       //   position="top-right"
//       //   toastOptions={{
//       //     style: {
//       //       background: "rgba(255, 255, 255, 0.1)",
//       //       color: "#fff",
//       //       backdropFilter: "blur(10px)",
//       //       border: "1px solid rgba(255, 255, 255, 0.2)",
//       //     },
//       //   }}
//       // />
//       // </div>
//   );
// }

// export default DashboardPage;
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

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "charts" | "data" | "recommendations"
  >("dashboard");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDatasets();
      setDatasets(data);
    } catch (error) {
      console.error("Failed to load datasets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetSelect = async (datasetId: string) => {
    try {
      const dataset = await dataService.getDataset(datasetId);
      setSelectedDataset(dataset);
      setCurrentView("charts");
    } catch (error) {
      console.error("Failed to load dataset:", error);
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
          <ChartView dataset={selectedDataset} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">
              Please select a dataset to visualize
            </p>
          </div>
        );
      case "data":
        return (
          <DataManager datasets={datasets} onDatasetChange={loadDatasets} />
        );
      case "recommendations":
        return <Recommendations />;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={renderContent()} />
              <Route path="/*" element={<Navigate to="/Dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
