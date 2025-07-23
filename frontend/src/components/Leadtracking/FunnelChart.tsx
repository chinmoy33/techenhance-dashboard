// export default FunnelChart;
import React, { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { LoanData } from '../../types/LoanData';

// Import and register the funnel chart components
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';

// Register Chart.js components including the funnel chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    FunnelController,
    TrapezoidElement
);

interface FunnelChartProps {
    data: LoanData[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
    const chartRef = useRef<ChartJS>(null);

    // Calculate funnel stages based on your loan pipeline
    const calculateFunnelData = () => {
        const totalApplications = data.length;
        const interestedUsers = data.filter(item =>
            item.interested === 'yes' || item.interested === 'Yes'
        ).length;
        // const kycCompleted = data.filter(item => item.kyc_completed).length; // Removed for Stage 3
        const finalDisbursed = data.filter(item => item.final_disbursed_amt > 0).length;

        // Calculate total amounts for each stage
        const totalRequestedAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
        const interestedAmount = data
            .filter(item => item.interested === 'yes' || item.interested === 'Yes')
            .reduce((sum, item) => sum + (item.amount || 0), 0);
        // const kycAmount = data // Removed for Stage 3
        //     .filter(item => item.kyc_completed)
        //     .reduce((sum, item) => sum + (item.final_amount || 0), 0);
        const disbursedAmount = data
            .filter(item => item.final_disbursed_amt > 0)
            .reduce((sum, item) => sum + (item.final_disbursed_amt || 0), 0);

        return {
            stages: [
                {
                    label: 'Lead Capture',
                    count: totalApplications,
                    amount: totalRequestedAmount,
                    color: 'rgba(59, 130, 246, 0.8)', // Blue
                    borderColor: 'rgba(59, 130, 246, 1)'
                },
                {
                    label: 'Qualified Leads',
                    count: interestedUsers,
                    amount: interestedAmount,
                    color: 'rgba(249, 115, 22, 0.8)', // Orange
                    borderColor: 'rgba(249, 115, 22, 1)'
                },
                // Removed Stage 3 (3-Propose)
                {
                    label: 'Disbursal', 
                    count: finalDisbursed,
                    amount: disbursedAmount,
                    color: 'rgba(245, 158, 11, 0.8)', // Yellow
                    borderColor: 'rgba(245, 158, 11, 1)'
                }
            ]
        };
    };

    const funnelData = calculateFunnelData();

    // Prepare chart data for vertical funnel visualization
    // Using normalized values (0-1) as recommended by the funnel chart plugin
    const maxCount = Math.max(...funnelData.stages.map(stage => stage.count));
    const normalizedData = funnelData.stages.map(stage =>
        maxCount > 0 ? stage.count / maxCount : 0
    );

    const chartData = {
        labels: funnelData.stages.map(stage => stage.label),
        datasets: [
            {
                label: 'Loan Pipeline',
                data: normalizedData,
                backgroundColor: funnelData.stages.map(stage => stage.color),
                borderColor: funnelData.stages.map(stage => stage.borderColor),
                borderWidth: 2,
            }
        ]
    };

    // Chart configuration options for vertical funnel
    const options = {
        indexAxis: 'y' as const, // This makes the funnel vertical
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide legend for cleaner funnel look
            },
            title: {
                display: true,
                text: 'Loans Pipeline Funnel',
                color: '#FFFFFF',
                font: {
                    size: 20,
                    weight: 'bold' as const
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                titleColor: '#FFFFFF',
                bodyColor: '#D1D5DB',
                borderColor: '#4B5563',
                borderWidth: 1,
                callbacks: {
                    // Custom tooltip to show both count and amount
                    label: function (context: any) {
                        const stageIndex = context.dataIndex;
                        const stage = funnelData.stages[stageIndex];
                        const percentage = funnelData.stages[0].count > 0
                            ? ((stage.count / funnelData.stages[0].count) * 100).toFixed(1)
                            : '0.0';

                        return [
                            `Applications: ${stage.count} (${percentage}%)`,
                            `Amount: ₹${stage.amount.toLocaleString()}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                display: false, // Hide x-axis for cleaner funnel look
            },
            y: {
                display: true,
                grid: {
                    display: false, // Hide grid lines
                },
                ticks: {
                    color: '#D1D5DB',
                    font: {
                        size: 12,
                        weight: 'bold' as const
                    }
                }
            }
        },
        // Funnel-specific options for vertical orientation
        sort: 'desc', // Sort in descending order for funnel effect
        gap: 4, // Gap between trapezoids (increased for better vertical spacing)
        // Animation configuration
        animation: {
            duration: 1200,
            easing: 'easeInOutQuart' as const
        },
        // Layout configuration for vertical funnel
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        }
    };

    // Cleanup chart on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    let attribute1;

    if (window.innerWidth <= 768) {
        attribute1 = "w-[90vw]";
    }
    else {
        attribute1 = "";
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            {/* Chart Container - Increased height for vertical funnel */}
            <div className={`${attribute1} h-[500px] mb-6`}>
                <Chart
                    ref={chartRef}
                    type="funnel"
                    data={chartData}
                    options={options}
                />
            </div>

            {/* Stage Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Changed md:grid-cols-4 to md:grid-cols-3 */}
                {funnelData.stages.map((stage, index) => {
                    const conversionRate = index === 0
                        ? 100
                        : funnelData.stages[0].count > 0
                            ? ((stage.count / funnelData.stages[0].count) * 100).toFixed(1)
                            : '0.0';

                    return (
                        <div
                            key={stage.label}
                            className="bg-gray-700 rounded-lg p-4 text-center border-l-4"
                            style={{ borderLeftColor: stage.borderColor }}
                        >
                            {/* Stage Label */}
                            <div className="text-gray-300 text-sm font-medium mb-2">
                                {stage.label}
                            </div>

                            {/* Application Count */}
                            <div
                                className="text-2xl font-bold mb-1"
                                style={{ color: stage.borderColor }}
                            >
                                {stage.count}
                            </div>

                            {/* Amount */}
                            <div className="text-gray-400 text-xs mb-2">
                                ₹{stage.amount.toLocaleString()}
                            </div>

                            {/* Conversion Rate */}
                            <div className="text-gray-500 text-xs">
                                {conversionRate}% conversion
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Statistics */}
            <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-gray-300 text-sm">Overall Conversion</div>
                        <div className="text-white text-lg font-semibold">
                            {funnelData.stages[0].count > 0
                                ? `${((funnelData.stages[2].count / funnelData.stages[0].count) * 100).toFixed(1)}%` // Changed index from 3 to 2
                                : '0.0%'
                            }
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-300 text-sm">Total Pipeline Value</div>
                        <div className="text-white text-lg font-semibold">
                            ₹{funnelData.stages[0].amount.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-300 text-sm">Closed Value</div>
                        <div className="text-white text-lg font-semibold">
                            ₹{funnelData.stages[2].amount.toLocaleString()} {/* Changed index from 3 to 2 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelChart;