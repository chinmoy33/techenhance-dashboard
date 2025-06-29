import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  BarChart3,
  Hash,
  Calendar,
  Type,
  ToggleLeft,
  ToggleRight,
  Palette,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Dataset } from "../../types";
import toast from "react-hot-toast";

interface AttributeSelectorProps {
  dataset: Dataset;
  selectedAttributes: string[];
  onAttributeChange: (attributes: string[]) => void;
  onDataTypeChange?: (
    attribute: string,
    dataType: "number" | "string" | "date"
  ) => void;
}

interface AttributeInfo {
  name: string;
  type: "number" | "string" | "date";
  selected: boolean;
  sampleValues: any[];
  uniqueCount: number;
  nullCount: number;
}

// Maximum number of attributes that can be selected at once
const MAX_SELECTION_LIMIT = 3;

// Attributes to exclude from display
const EXCLUDED_ATTRIBUTES = [
  "Person's Name",
  "Phone Number",
  "Date of Birth",
  "Date",
  "CHQ.NO",
  "Transaction Details",
  "Education",
  "Email Address",
];

//================= Main Functional Component ===================
const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  dataset,
  selectedAttributes,
  onAttributeChange,
  onDataTypeChange,
}) => {
  // ===== STATE MANAGEMENT =====
  const [attributes, setAttributes] = useState<AttributeInfo[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "selected" | "numeric" | "categorical"
  >("all");

  // ===== INITIALIZATION EFFECT =====
  // Analyze dataset attributes when data changes
  useEffect(() => {
    if (dataset.data && dataset.data.length > 0) {
      analyzeAttributes();
    }
  }, [dataset.data,selectedAttributes]);

  // ===== ATTRIBUTE ANALYSIS FUNCTION =====
  /**
   * Analyzes dataset attributes to determine data types and statistics
   * Automatically detects numeric, categorical, and date columns
   * Excludes specified attributes from being displayed
   */
  const analyzeAttributes = () => {
    const firstRow = dataset.data[0];
    const attributeNames = Object.keys(firstRow).filter(
      (name) => !EXCLUDED_ATTRIBUTES.includes(name)
    );

    const analyzedAttributes: AttributeInfo[] = attributeNames.map((name) => {
      // Extract all non-null values for analysis
      const values = dataset.data
        .map((row) => row[name])
        .filter((val) => val !== null && val !== undefined && val !== "");
      const sampleValues = values.slice(0, 5);
      const uniqueCount = new Set(values).size;
      const nullCount = dataset.data.length - values.length;

      // Determine data type using heuristics
      let type: "number" | "string" | "date" = "string";

      // Check if it's a number (80% threshold for numeric classification)
      const numericValues = values.filter(
        (val) => !isNaN(Number(val)) && val !== ""
      );
      if (numericValues.length > values.length * 0.8) {
        type = "number";
      }

      // Check if it's a date (80% threshold for date classification)
      const dateValues = values.filter((val) => {
        const date = new Date(val);
        return (
          !isNaN(date.getTime()) &&
          val.toString().match(/\d{4}|\d{2}\/\d{2}|\d{2}-\d{2}/)
        );
      });
      if (dateValues.length > values.length * 0.8) {
        type = "date";
      }

      return {
        name,
        type,
        selected: selectedAttributes.includes(name),
        sampleValues,
        uniqueCount,
        nullCount,
      };
    });

    setAttributes(analyzedAttributes);
  };

  // ===== SELECTION MANAGEMENT FUNCTIONS =====

  /**
   * Toggles attribute selection with validation
   * Enforces maximum selection limit and provides user feedback
   */
  const toggleAttribute = (attributeName: string) => {
    const isCurrentlySelected = selectedAttributes.includes(attributeName);

    // Check if trying to add more than maximum allowed
    if (
      !isCurrentlySelected &&
      selectedAttributes.length >= MAX_SELECTION_LIMIT
    ) {
      toast.error(
        `Maximum ${MAX_SELECTION_LIMIT} attributes can be selected at once`
      );
      return;
    }

    // Update selection
    const newSelected = isCurrentlySelected
      ? selectedAttributes.filter((attr) => attr !== attributeName)
      : [...selectedAttributes, attributeName];

    onAttributeChange(newSelected);

    // Update local state for immediate UI feedback
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.name === attributeName
          ? { ...attr, selected: !attr.selected }
          : attr
      )
    );

    // Provide user feedback
    const action = isCurrentlySelected ? "removed" : "added";
    toast.success(
      `${attributeName} ${action} ${
        isCurrentlySelected ? "from" : "to"
      } selection`
    );
  };

  /**
   * Selects all numeric attributes (up to the limit)
   */
  const selectAllNumeric = () => {
    const numericAttributes = attributes
      .filter((attr) => attr.type === "number")
      .map((attr) => attr.name)
      .slice(0, MAX_SELECTION_LIMIT); // Respect selection limit

    onAttributeChange(numericAttributes);
    setAttributes((prev) =>
      prev.map((attr) => ({
        ...attr,
        selected: numericAttributes.includes(attr.name),
      }))
    );

    toast.success(`Selected ${numericAttributes.length} numeric attributes`);
  };

  /**
   * Selects all categorical attributes with low cardinality (up to the limit)
   */
  const selectAllCategorical = () => {
    const categoricalAttributes = attributes
      .filter((attr) => attr.type === "string" && attr.uniqueCount < 20)
      .map((attr) => attr.name)
      .slice(0, MAX_SELECTION_LIMIT); // Respect selection limit

    onAttributeChange(categoricalAttributes);
    setAttributes((prev) =>
      prev.map((attr) => ({
        ...attr,
        selected: categoricalAttributes.includes(attr.name),
      }))
    );

    toast.success(
      `Selected ${categoricalAttributes.length} categorical attributes`
    );
  };

  /**
   * Clears all selected attributes
   */
  const clearSelection = () => {
    onAttributeChange([]);
    setAttributes((prev) => prev.map((attr) => ({ ...attr, selected: false })));
    toast.success("Cleared all selections");
  };

  /**
   * Changes the data type of an attribute
   */
  const changeAttributeType = (
    attributeName: string,
    newType: "number" | "string" | "date"
  ) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.name === attributeName ? { ...attr, type: newType } : attr
      )
    );

    if (onDataTypeChange) {
      onDataTypeChange(attributeName, newType);
    }

    toast.success(`Changed ${attributeName} type to ${newType}`);
  };

  // ===== UTILITY FUNCTIONS =====

  /**
   * Gets the appropriate icon for a data type
   */
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "number":
        return Hash;
      case "date":
        return Calendar;
      default:
        return Type;
    }
  };

  /**
   * Gets the appropriate color for a data type
   */
  const getTypeColor = (type: string) => {
    switch (type) {
      case "number":
        return "text-blue-400";
      case "date":
        return "text-green-400";
      default:
        return "text-purple-400";
    }
  };

  // ===== FILTERING LOGIC =====

  /**
   * Filters attributes based on current filter type
   */
  const filteredAttributes = attributes.filter((attr) => {
    switch (filterType) {
      case "selected":
        return attr.selected;
      case "numeric":
        return attr.type === "number";
      case "categorical":
        return attr.type === "string";
      default:
        return true;
    }
  });

  // ===== RENDER COMPONENT =====
  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center space-x-2">
            <BarChart3 size={20} className="text-primary-400" />
            <span>Attribute Selector</span>
          </h3>
          <div className="flex items-center space-x-4">
            <p className="text-gray-400">
              Choose which columns to visualize • {selectedAttributes.length}/
              {MAX_SELECTION_LIMIT} selected
            </p>
            {/* Selection limit warning */}
            {selectedAttributes.length >= MAX_SELECTION_LIMIT && (
              <div className="flex items-center space-x-1 text-orange-400">
                <AlertTriangle size={16} />
                <span className="text-sm">Selection limit reached</span>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="glass-button px-3 py-2 rounded-lg flex items-center space-x-2 text-sm"
          >
            {showAdvanced ? (
              <ToggleRight size={16} />
            ) : (
              <ToggleLeft size={16} />
            )}
            <span>Advanced</span>
          </button>

          <button
            onClick={analyzeAttributes}
            className="glass-button px-3 py-2 rounded-lg flex items-center space-x-2 text-sm"
            title="Refresh analysis"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={selectAllNumeric}
          disabled={selectedAttributes.length >= MAX_SELECTION_LIMIT}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Hash size={16} className="text-blue-400" />
          <span>Select Numeric</span>
        </button>

        <button
          onClick={selectAllCategorical}
          disabled={selectedAttributes.length >= MAX_SELECTION_LIMIT}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Type size={16} className="text-purple-400" />
          <span>Select Categorical</span>
        </button>

        <button
          onClick={clearSelection}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-red-500/20"
        >
          <X size={16} className="text-red-400" />
          <span>Clear All</span>
        </button>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="glass-button px-4 py-2 rounded-lg text-sm bg-transparent border border-white/20 text-white"
          >
            <option value="all" className="bg-slate-800">
              All Attributes
            </option>
            <option value="selected" className="bg-slate-800">
              Selected Only
            </option>
            <option value="numeric" className="bg-slate-800">
              Numeric Only
            </option>
            <option value="categorical" className="bg-slate-800">
              Categorical Only
            </option>
          </select>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredAttributes.map((attribute) => {
          const TypeIcon = getTypeIcon(attribute.type);
          const typeColor = getTypeColor(attribute.type);
          const isDisabled =
            !attribute.selected &&
            selectedAttributes.length >= MAX_SELECTION_LIMIT;

          return (
            <div
              key={attribute.name}
              className={`glass-card p-4 transition-all duration-200 cursor-pointer hover:scale-105 ${
                attribute.selected
                  ? "bg-primary-500/20 border-primary-500/50"
                  : isDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/10"
              }`}
              onClick={() => !isDisabled && toggleAttribute(attribute.name)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <TypeIcon size={16} className={typeColor} />
                  <span
                    className="font-medium text-white truncate"
                    title={attribute.name}
                  >
                    {attribute.name}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) toggleAttribute(attribute.name);
                  }}
                  disabled={isDisabled}
                  className={`p-1 rounded transition-colors ${
                    attribute.selected
                      ? "text-primary-400 hover:text-primary-300"
                      : isDisabled
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {attribute.selected ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>

              {/* Attribute Statistics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Type:</span>
                  <span className={`capitalize ${typeColor}`}>
                    {attribute.type}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Unique:</span>
                  <span>{attribute.uniqueCount}</span>
                </div>

                {attribute.nullCount > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Missing:</span>
                    <span className="text-orange-400">
                      {attribute.nullCount}
                    </span>
                  </div>
                )}

                {/* Advanced Information */}
                {showAdvanced && (
                  <>
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-gray-500 text-xs mb-1">
                        Sample values:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {attribute.sampleValues
                          .slice(0, 3)
                          .map((value, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 truncate max-w-20"
                              title={String(value)}
                            >
                              {String(value)}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Type Selector */}
                    <div className="pt-2">
                      <p className="text-gray-500 text-xs mb-1">Data type:</p>
                      <div className="flex space-x-1">
                        {["number", "string", "date"].map((type) => (
                          <button
                            key={type}
                            onClick={(e) => {
                              e.stopPropagation();
                              changeAttributeType(attribute.name, type as any);
                            }}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              attribute.type === type
                                ? "bg-primary-500/30 text-primary-300"
                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAttributes.length === 0 && (
        <div className="text-center py-8">
          <Palette size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">
            No attributes match the current filter
          </p>
          <button
            onClick={() => setFilterType("all")}
            className="mt-2 glass-button px-4 py-2 rounded-lg text-sm"
          >
            Show All Attributes
          </button>
        </div>
      )}

      {/* Selection Summary */}
      {selectedAttributes.length > 0 && (
        <div className="glass-card p-4 bg-primary-500/10 border-primary-500/30">
          <h4 className="font-medium text-white mb-2">
            Selected Attributes ({selectedAttributes.length}/
            {MAX_SELECTION_LIMIT})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedAttributes.map((attr) => {
              const attribute = attributes.find((a) => a.name === attr);
              const TypeIcon = attribute ? getTypeIcon(attribute.type) : Type;
              const typeColor = attribute
                ? getTypeColor(attribute.type)
                : "text-gray-400";

              return (
                <div
                  key={attr}
                  className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-sm"
                >
                  <TypeIcon size={14} className={typeColor} />
                  <span className="text-white">{attr}</span>
                  <button
                    onClick={() => toggleAttribute(attr)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeSelector;
