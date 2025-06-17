import React, { useState, useEffect } from "react";
import {
  Plus,
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
} from "lucide-react";
import { Dataset } from "../types";
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

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  dataset,
  selectedAttributes,
  onAttributeChange,
  onDataTypeChange,
}) => {
  const [attributes, setAttributes] = useState<AttributeInfo[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "selected" | "numeric" | "categorical"
  >("all");

  useEffect(() => {
    if (dataset.data && dataset.data.length > 0) {
      analyzeAttributes();
    }
  }, [dataset.data]);

  const analyzeAttributes = () => {
    const firstRow = dataset.data[0];
    const attributeNames = Object.keys(firstRow);

    const analyzedAttributes: AttributeInfo[] = attributeNames.map((name) => {
      const values = dataset.data
        .map((row) => row[name])
        .filter((val) => val !== null && val !== undefined && val !== "");
      const sampleValues = values.slice(0, 5);
      const uniqueCount = new Set(values).size;
      const nullCount = dataset.data.length - values.length;

      // Determine data type
      let type: "number" | "string" | "date" = "string";

      // Check if it's a number
      const numericValues = values.filter(
        (val) => !isNaN(Number(val)) && val !== ""
      );
      if (numericValues.length > values.length * 0.8) {
        type = "number";
      }

      // Check if it's a date
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

  const toggleAttribute = (attributeName: string) => {
    const newSelected = selectedAttributes.includes(attributeName)
      ? selectedAttributes.filter((attr) => attr !== attributeName)
      : [...selectedAttributes, attributeName];

    onAttributeChange(newSelected);

    // Update local state
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.name === attributeName
          ? { ...attr, selected: !attr.selected }
          : attr
      )
    );
  };

  const selectAllNumeric = () => {
    const numericAttributes = attributes
      .filter((attr) => attr.type === "number")
      .map((attr) => attr.name);

    onAttributeChange(numericAttributes);
    setAttributes((prev) =>
      prev.map((attr) => ({
        ...attr,
        selected: attr.type === "number",
      }))
    );

    toast.success(`Selected ${numericAttributes.length} numeric attributes`);
  };

  const selectAllCategorical = () => {
    const categoricalAttributes = attributes
      .filter((attr) => attr.type === "string" && attr.uniqueCount < 20)
      .map((attr) => attr.name);

    onAttributeChange(categoricalAttributes);
    setAttributes((prev) =>
      prev.map((attr) => ({
        ...attr,
        selected: attr.type === "string" && attr.uniqueCount < 20,
      }))
    );

    toast.success(
      `Selected ${categoricalAttributes.length} categorical attributes`
    );
  };

  const clearSelection = () => {
    onAttributeChange([]);
    setAttributes((prev) => prev.map((attr) => ({ ...attr, selected: false })));
    toast.success("Cleared all selections");
  };

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

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center space-x-2">
            <BarChart3 size={20} className="text-primary-400" />
            <span>Attribute Selector</span>
          </h3>
          <p className="text-gray-400">
            Choose which columns to visualize • {selectedAttributes.length} of{" "}
            {attributes.length} selected
          </p>
        </div>

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

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={selectAllNumeric}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-blue-500/20"
        >
          <Hash size={16} className="text-blue-400" />
          <span>Select Numeric</span>
        </button>

        <button
          onClick={selectAllCategorical}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-purple-500/20"
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

          return (
            <div
              key={attribute.name}
              className={`glass-card p-4 transition-all duration-200 cursor-pointer hover:scale-105 ${
                attribute.selected
                  ? "bg-primary-500/20 border-primary-500/50"
                  : "hover:bg-white/10"
              }`}
              onClick={() => toggleAttribute(attribute.name)}
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
                    toggleAttribute(attribute.name);
                  }}
                  className={`p-1 rounded transition-colors ${
                    attribute.selected
                      ? "text-primary-400 hover:text-primary-300"
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
            Selected Attributes ({selectedAttributes.length})
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
