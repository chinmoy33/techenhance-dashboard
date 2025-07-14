import React from "react";
import { Dataset } from "../../types";

interface DataPreviewTableProps {
    dataset: Dataset;
    selectedAttributes: string[];
    filteredData: any[];
}

const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
    dataset,
    selectedAttributes,
    filteredData,
}) => {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filtered Data Preview</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            {selectedAttributes.map((attr) => (
                                <th
                                    key={attr}
                                    className="text-left py-2 px-4 text-gray-300 font-medium"
                                >
                                    {attr.charAt(0).toUpperCase() + attr.slice(1)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.slice(0, 5).map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                {selectedAttributes.map((attr) => (
                                    <td key={attr} className="py-2 px-4 text-gray-400">
                                        {typeof row[attr] === "number"
                                            ? row[attr].toLocaleString()
                                            : String(row[attr])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData && filteredData.length > 5 && (
                    <p className="text-center text-gray-500 mt-4">
                        Showing 5 of {filteredData.length} rows
                    </p>
                )}
            </div>
        </div>
    );
};

export default DataPreviewTable;