import React, { useState, useRef, useCallback } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Database,
  TrendingUp,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  UserSearch,
  ArrowRightCircle,
  Settings,
} from "lucide-react";
import { ViewType } from "../types";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isTablet?: boolean; // Optional prop to handle tablet-specific styles
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isTablet }) => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 64 * 4 = 256px
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 400;
  const collapsedWidth = 80;

  const menuItems = [
    { id: "data" as ViewType, label: "Data Manager", icon: Database },
    { id: "dashboard" as ViewType, label: "Dashboard", icon: LayoutDashboard },
    {
      id: "searchcustomerpage" as ViewType,
      label: "Search Customer",
      icon: UserSearch,
    },
    {
      id: "recommendations" as ViewType,
      label: "Recommendations",
      icon: TrendingUp,
    },

    { id: "charts" as ViewType, label: "Charts", icon: BarChart3 },
    { id: "allCharts" as ViewType, label: "All Charts", icon: Grid3X3 },
    { id: "account" as ViewType, label: "Account Settings", icon: Settings },
  ];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        setIsCollapsed(false);
      }
    },
    [isResizing, minWidth, maxWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const currentWidth = isCollapsed ? collapsedWidth : sidebarWidth;

  let position = "sticky";

  if(isCollapsed && !isTablet)
  {
    position="fixed"
  }
  else
  {
    position="sticky"
  }

  return (
    <aside
      ref={sidebarRef}
      className={`${position} top-[80px] left-0 bg-gray-900 border-r border-white/10 transition-all duration-300 ease-in-out flex-shrink-0 z-50`}
      style={{ width: `${currentWidth}px`,height: "calc(100vh - 80px)", overflowY: "auto" }}
    >
      {/* Sidebar Content */}
      <div className="h-full flex flex-col p-4 overflow-auto">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed}
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-gray-400" />
            ) : (
              <ChevronLeft size={20} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="font-medium truncate">{item.label}</span>
                    {isActive && (
                      <ArrowRightCircle
                        size={16}
                        className="ml-auto text-primary-400 flex-shrink-0"
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="mt-8 p-4 glass-card rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Charts</span>
                <span className="text-primary-400 font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chart Types</span>
                <span className="text-accent-400 font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data Points</span>
                <span className="text-green-400 font-medium">2.4K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update</span>
                <span className="text-green-400 font-medium">Live</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary-400/50 transition-colors group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Resize Indicator */}
      {isResizing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-50 pointer-events-none">
          <div
            className="absolute top-0 h-full w-1 bg-primary-400 shadow-lg"
            style={{ left: `${sidebarWidth}px` }}
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
