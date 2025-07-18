import React, { useState, useCallback, useRef } from "react";

interface RangeSelectorProps {
    data: any[];
    selectedRange: [number, number];
    onRangeChange: (range: [number, number]) => void;
    labels: string[];
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
    data,
    selectedRange,
    onRangeChange,
    labels,
}) => {
    const [isDragging, setIsDragging] = useState<"start" | "end" | "range" | null>(
        null
    );
    const [dragStart, setDragStart] = useState<number>(0);
    const sliderRef = useRef<HTMLDivElement>(null);

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
        <div className="glass-card p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Data Range Selector</h4>
                <div className="text-xs text-gray-400">
                    {labels[selectedRange[0]]} - {labels[selectedRange[1]]} (
                    {selectedRange[1] - selectedRange[0] + 1} records)
                </div>
            </div>

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
                    className="absolute top-0 bottom-0 bg-primary-500/40 border border-primary-500/60 rounded cursor-move"
                    style={{
                        left: `${startPercentage}%`,
                        width: `${endPercentage - startPercentage}%`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "range")}
                />

                {/* Start handle */}
                <div
                    className="absolute top-1/2 w-4 h-8 bg-primary-500 border-2 border-white rounded cursor-grab hover:bg-primary-400 transition-colors"
                    style={{
                        left: `${startPercentage}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, "start")}
                />

                {/* End handle */}
                <div
                    className="absolute top-1/2 w-4 h-8 bg-primary-500 border-2 border-white rounded cursor-grab hover:bg-primary-400 transition-colors"
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
    );
};

export default RangeSelector;