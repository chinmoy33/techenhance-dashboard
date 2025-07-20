import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

interface AttributeInfo {
    name: string;
    type: "number" | "string" | "date";
}

interface RangeSelectorProps {
    data: any[];
    selectedRange: [number, number];
    onRangeChange: (range: [number, number]) => void;
    labels: string[];
    selectedAttributes?: string[];
    attributeTypes?: AttributeInfo[];
}

interface DateValue {
    startDate: Date | string | null;
    endDate: Date | string | null;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
    data,
    selectedRange,
    onRangeChange,
    labels,
    selectedAttributes = [],
    attributeTypes = [],
}) => {
    const [isDragging, setIsDragging] = useState<"start" | "end" | "range" | null>(null);
    const [dragStart, setDragStart] = useState<number>(0);
    const [dateValue, setDateValue] = useState<DateValue>({
        startDate: null,
        endDate: null,
    });
    const sliderRef = useRef<HTMLDivElement>(null);

    // Check if the first selected attribute is a date type
    const isDateAttribute = useMemo(() => {
        if (selectedAttributes.length === 0) return false;
        const firstAttribute = selectedAttributes[0];
        const attributeType = attributeTypes.find(attr => attr.name === firstAttribute);
        return attributeType?.type === "date";
    }, [selectedAttributes, attributeTypes]);

    // Parse DD/MM/YYYY format to Date object
    const parseDDMMYYYY = useCallback((dateString: string): Date => {
        if (!dateString) return new Date(NaN);
        const parts = dateString.split('/');
        if (parts.length !== 3) return new Date(NaN);
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }, []);

    // Format Date object to DD/MM/YYYY format
    const formatDDMMYYYY = useCallback((date: Date): string => {
        if (!date || isNaN(date.getTime())) return "";
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }, []);

    // Get available date range from dataset
    const availableDateRange = useMemo(() => {
        if (!isDateAttribute || selectedAttributes.length === 0 || !data.length) {
            return { minDate: null, maxDate: null };
        }

        const firstAttribute = selectedAttributes[0];
        const dates = data
            .map(item => {
                const dateStr = item[firstAttribute];
                return parseDDMMYYYY(dateStr);
            })
            .filter(date => !isNaN(date.getTime()))
            .sort((a, b) => a.getTime() - b.getTime());

        if (dates.length === 0) {
            return { minDate: null, maxDate: null };
        }

        return {
            minDate: dates[0],
            maxDate: dates[dates.length - 1]
        };
    }, [isDateAttribute, selectedAttributes, data, parseDDMMYYYY]);

    // Convert date range to data indices
    const getDateRangeIndices = useCallback((startDate: Date | null, endDate: Date | null): [number, number] => {
        if (!startDate || !endDate || selectedAttributes.length === 0) {
            return [0, data.length - 1];
        }

        const firstAttribute = selectedAttributes[0];
        let startIndex = 0;
        let endIndex = data.length - 1;

        // Find the indices that match the date range
        for (let i = 0; i < data.length; i++) {
            const itemDateStr = data[i][firstAttribute];
            const itemDate = parseDDMMYYYY(itemDateStr);

            if (!isNaN(itemDate.getTime())) {
                if (itemDate >= startDate && startIndex === 0) {
                    startIndex = i;
                }
                if (itemDate <= endDate) {
                    endIndex = i;
                }
            }
        }

        return [startIndex, Math.max(startIndex, endIndex)];
    }, [data, selectedAttributes, parseDDMMYYYY]);

    // Update date value when range changes externally
    useEffect(() => {
        if (isDateAttribute && selectedAttributes.length > 0) {
            const firstAttribute = selectedAttributes[0];
            const startDateStr = data[selectedRange[0]]?.[firstAttribute];
            const endDateStr = data[selectedRange[1]]?.[firstAttribute];

            if (startDateStr && endDateStr) {
                const startDate = parseDDMMYYYY(startDateStr);
                const endDate = parseDDMMYYYY(endDateStr);

                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    setDateValue({
                        startDate: dayjs(startDate).format('YYYY-MM-DD'),
                        endDate: dayjs(endDate).format('YYYY-MM-DD'),
                    });
                }
            }
        }
    }, [selectedRange, isDateAttribute, selectedAttributes, data, parseDDMMYYYY]);

    // Handle date picker value change
    const handleDateValueChange = useCallback((newValue: any) => {
        if (!newValue || !isDateAttribute) return;

        const { startDate, endDate } = newValue;
        setDateValue({ startDate, endDate });

        if (startDate && endDate) {
            // Convert string dates to Date objects
            const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
            const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

            const [newStartIndex, newEndIndex] = getDateRangeIndices(start, end);
            onRangeChange([newStartIndex, newEndIndex]);
        }
    }, [isDateAttribute, getDateRangeIndices, onRangeChange]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent, type: "start" | "end" | "range") => {
            e.preventDefault();
            setIsDragging(type);
            setDragStart(e.clientX);
        },
        []
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !sliderRef.current) return;

            const rect = sliderRef.current.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newIndex = Math.round(percentage * (data.length - 1));

            if (isDragging === "start") {
                onRangeChange([Math.min(newIndex, selectedRange[1] - 1), selectedRange[1]]);
            } else if (isDragging === "end") {
                onRangeChange([selectedRange[0], Math.max(newIndex, selectedRange[0] + 1)]);
            } else if (isDragging === "range") {
                const rangeDiff = selectedRange[1] - selectedRange[0];
                const newStart = Math.max(
                    0,
                    Math.min(data.length - rangeDiff - 1, newIndex - Math.floor(rangeDiff / 2))
                );
                onRangeChange([newStart, newStart + rangeDiff]);
            }
        },
        [isDragging, selectedRange, data.length, onRangeChange]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(null);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const startPercentage = (selectedRange[0] / (data.length - 1)) * 100;
    const endPercentage = (selectedRange[1] / (data.length - 1)) * 100;

    return (
        <div className="glass-card p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white flex items-center space-x-2">
                    <span>Data Range Selector</span>
                    {isDateAttribute && (
                        <Calendar size={16} className="text-green-400" />
                    )}
                </h4>
                <div className="text-xs text-gray-400">
                    {labels[selectedRange[0]]} - {labels[selectedRange[1]]} (
                    {selectedRange[1] - selectedRange[0] + 1} records)
                </div>
            </div>

            {/* Date Range Picker - Only show for date attributes */}
            {isDateAttribute && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center space-x-2">
                        <Calendar size={14} className="text-green-400" />
                        <span>Select Date Range</span>
                    </label>
                    <div className="relative">
                        <Datepicker
                            value={dateValue}
                            onChange={handleDateValueChange}
                            showShortcuts={true}
                            minDate={availableDateRange.minDate}
                            maxDate={availableDateRange.maxDate}
                            configs={{
                                shortcuts: {
                                    today: "Today",
                                    yesterday: "Yesterday",
                                    past: period => `Last ${period} days`,
                                    currentMonth: "This month",
                                    pastMonth: "Last month"
                                }
                            }}
                            primaryColor="blue"
                            useRange={true}
                            displayFormat="DD/MM/YYYY"
                            readOnly={false}
                            placeholder="Select date range..."
                            inputClassName="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
                            containerClassName="relative"
                            toggleClassName="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200"
                            popoverClassName="bg-slate-800 border border-white/20 rounded-lg shadow-2xl backdrop-blur-sm"
                        />
                    </div>
                    {availableDateRange.minDate && availableDateRange.maxDate && (
                        <div className="text-xs text-gray-400 flex justify-between">
                            <span>Available: {formatDDMMYYYY(availableDateRange.minDate)}</span>
                            <span>to {formatDDMMYYYY(availableDateRange.maxDate)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Traditional Range Slider */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                    {isDateAttribute ? "Fine-tune Selection" : "Data Range"}
                </label>
                <div
                    ref={sliderRef}
                    className="relative h-12 bg-gray-700 rounded-lg cursor-pointer"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                    }}
                >
                    {/* Background track */}
                    <div className="absolute inset-0 rounded-lg bg-white/10" />

                    {/* Selected range */}
                    <div
                        className="absolute top-0 bottom-0 bg-blue-500/40 border border-blue-500/60 rounded cursor-move transition-all duration-200 hover:bg-blue-500/50"
                        style={{
                            left: `${startPercentage}%`,
                            width: `${endPercentage - startPercentage}%`,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, "range")}
                    />

                    {/* Start handle */}
                    <div
                        className="absolute top-1/2 w-4 h-8 bg-blue-500 border-2 border-white rounded cursor-grab hover:bg-blue-400 transition-all duration-200 shadow-lg"
                        style={{
                            left: `${startPercentage}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, "start")}
                    />

                    {/* End handle */}
                    <div
                        className="absolute top-1/2 w-4 h-8 bg-blue-500 border-2 border-white rounded cursor-grab hover:bg-blue-400 transition-all duration-200 shadow-lg"
                        style={{
                            left: `${endPercentage}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, "end")}
                    />

                    {/* Data points indicators */}
                    {data.map((_, index) => (
                        <div
                            key={index}
                            className="absolute top-1/2 w-1 h-4 bg-white/30 rounded-full"
                            style={{
                                left: `${(index / (data.length - 1)) * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{labels[0]}</span>
                    <span>{labels[labels.length - 1]}</span>
                </div>
            </div>
        </div>
    );
};

export default RangeSelector;