import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { TransactionData } from '../../types/searchcustomerpage';
import {
    TrendingDown,
    TrendingUp,
    Activity,
    Calendar,
    CreditCard,
    PieChart,
    BarChart3,
    Target,
    SearchX,
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

interface SpendingSummaryCardProps {
    transactions: TransactionData[];
}

// Date parsing utility function
const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const trimmedDate = dateString.trim();

    // Handle dd-mm-yyyy format (your data format)
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmedDate)) {
        const parts = trimmedDate.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);

            // Basic validation
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
                // Create date with month-1 since JavaScript months are 0-indexed
                return new Date(year, month - 1, day);
            }
        }
    }

    // Handle other common formats
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmedDate)) {
        const parts = trimmedDate.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);

            if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
                return new Date(year, month - 1, day);
            }
        }
    }

    // Fallback to native Date parsing
    const fallbackDate = new Date(dateString);
    return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
};

export const SpendingSummaryCard: React.FC<SpendingSummaryCardProps> = ({ transactions }) => {
    const spendingAnalysis = useMemo(() => {

        // Handle empty transactions
        if (transactions.length === 0) {
            return (
                <div className="text-center py-6 text-gray-400 bg-gradient-to-br from-violet-900/60 to-purple-800/60 rounded-xl p-6 shadow-lg border border-violet-600/50">
                    <SearchX className="h-12 w-12 mx-auto mb-2" />
                    <p>No transactions available for analysis.</p>
                </div>
            );
        }

        // Calculate totals
        const totalDeposits = transactions.reduce((sum, tx) =>
            sum + (parseInt(tx["Deposit Amount"]) || 0), 0);
        const totalWithdrawals = transactions.reduce((sum, tx) =>
            sum + (parseInt(tx["Withdrawal Amount"]) || 0), 0);

        // Payment method distribution
        const paymentMethods = transactions.reduce((acc, tx) => {
            const method = tx["Digital Presence"] || 'Unknown';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Monthly spending trend with proper date parsing
        const monthlySpending = transactions.reduce((acc, tx) => {
            const date = parseDate(tx["Date"]);

            // Skip transactions with invalid dates
            if (!date) {
                console.warn(`Invalid date found: ${tx["Date"]}`);
                return acc;
            }

            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const withdrawal = parseInt(tx["Withdrawal Amount"]) || 0;
            const deposit = parseInt(tx["Deposit Amount"]) || 0;

            if (!acc[monthKey]) {
                acc[monthKey] = { withdrawals: 0, deposits: 0 };
            }
            acc[monthKey].withdrawals += withdrawal;
            acc[monthKey].deposits += deposit;
            return acc;
        }, {} as Record<string, { withdrawals: number; deposits: number }>);

        // Transaction amount ranges for spending behavior
        const amountRanges = transactions.reduce((acc, tx) => {
            const amount = parseInt(tx["Withdrawal Amount"]) || 0;
            if (amount === 0) return acc;

            let range = '';
            if (amount <= 1000) range = '₹0-1K';
            else if (amount <= 5000) range = '₹1K-5K';
            else if (amount <= 10000) range = '₹5K-10K';
            else if (amount <= 50000) range = '₹10K-50K';
            else range = '₹50K+';

            acc[range] = (acc[range] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Calculate spending insights
        const avgWithdrawal = totalWithdrawals / (transactions.filter(tx => parseInt(tx["Withdrawal Amount"]) > 0).length || 1);
        const avgDeposit = totalDeposits / (transactions.filter(tx => parseInt(tx["Deposit Amount"]) > 0).length || 1);
        const netFlow = totalDeposits - totalWithdrawals;

        return {
            totalDeposits,
            totalWithdrawals,
            netFlow,
            avgWithdrawal,
            avgDeposit,
            paymentMethods,
            monthlySpending,
            amountRanges,
            transactionCount: transactions.length
        };
    }, [transactions]);

    // Chart configurations
    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#e5e7eb',
                    font: { size: 11 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#f3f4f6',
                bodyColor: '#e5e7eb',
                borderColor: '#6b7280',
                borderWidth: 1
            }
        }
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb',
                    font: { size: 11 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#f3f4f6',
                bodyColor: '#e5e7eb',
                borderColor: '#6b7280',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: { color: '#9ca3af', font: { size: 10 } },
                grid: { color: 'rgba(75, 85, 99, 0.3)' }
            },
            y: {
                ticks: { color: '#9ca3af', font: { size: 10 } },
                grid: { color: 'rgba(75, 85, 99, 0.3)' }
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bg-gradient-to-br from-violet-900/60 to-purple-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-600/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg border border-violet-400/30">
                        <Activity className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Spending Analysis</h3>
                        <p className="text-sm text-violet-300">{spendingAnalysis.transactionCount} transactions analyzed</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-violet-400" />
                    <span className="text-sm text-violet-300">Behavior Insights</span>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/40">
                    <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-xs text-gray-400">Total Deposits</span>
                    </div>
                    <p className="text-lg font-bold text-green-400">{formatCurrency(spendingAnalysis.totalDeposits)}</p>
                    <p className="text-xs text-gray-500">Avg: {formatCurrency(spendingAnalysis.avgDeposit)}</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/40">
                    <div className="flex items-center space-x-2 mb-1">
                        <TrendingDown className="h-4 w-4 text-red-400" />
                        <span className="text-xs text-gray-400">Total Withdrawals</span>
                    </div>
                    <p className="text-lg font-bold text-red-400">{formatCurrency(spendingAnalysis.totalWithdrawals)}</p>
                    <p className="text-xs text-gray-500">Avg: {formatCurrency(spendingAnalysis.avgWithdrawal)}</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/40">
                    <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-gray-400">Net Flow</span>
                    </div>
                    <p className={`text-lg font-bold ${spendingAnalysis.netFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(spendingAnalysis.netFlow)}
                    </p>
                    <p className="text-xs text-gray-500">
                        {spendingAnalysis.netFlow >= 0 ? 'Positive' : 'Negative'} balance
                    </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/40">
                    <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-gray-400">Transactions</span>
                    </div>
                    <p className="text-lg font-bold text-purple-400">{spendingAnalysis.transactionCount}</p>
                    <p className="text-xs text-gray-500">Total records</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Payment Methods Pie Chart */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/40">
                    <div className="flex items-center space-x-2 mb-3">
                        <PieChart className="h-4 w-4 text-violet-400" />
                        <h4 className="text-sm font-medium text-gray-300">Payment Methods</h4>
                    </div>
                    <div className="h-48">
                        <Pie
                            data={{
                                labels: Object.keys(spendingAnalysis.paymentMethods),
                                datasets: [{
                                    data: Object.values(spendingAnalysis.paymentMethods),
                                    backgroundColor: [
                                        'rgba(147, 51, 234, 0.8)',
                                        'rgba(168, 85, 247, 0.8)',
                                        'rgba(192, 132, 252, 0.8)',
                                        'rgba(196, 181, 253, 0.8)',
                                        'rgba(221, 214, 254, 0.8)',
                                    ],
                                    borderColor: [
                                        'rgba(147, 51, 234, 1)',
                                        'rgba(168, 85, 247, 1)',
                                        'rgba(192, 132, 252, 1)',
                                        'rgba(196, 181, 253, 1)',
                                        'rgba(221, 214, 254, 1)',
                                    ],
                                    borderWidth: 1
                                }]
                            }}
                            options={pieChartOptions}
                        />
                    </div>
                </div>

                {/* Transaction Amount Ranges */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/40">
                    <div className="flex items-center space-x-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-violet-400" />
                        <h4 className="text-sm font-medium text-gray-300">Spending Ranges</h4>
                    </div>
                    <div className="h-48">
                        <Bar
                            data={{
                                labels: Object.keys(spendingAnalysis.amountRanges),
                                datasets: [{
                                    label: 'Transactions',
                                    data: Object.values(spendingAnalysis.amountRanges),
                                    backgroundColor: 'rgba(147, 51, 234, 0.7)',
                                    borderColor: 'rgba(147, 51, 234, 1)',
                                    borderWidth: 1
                                }]
                            }}
                            options={barChartOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/40 mb-4">
                <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-violet-400" />
                    <h4 className="text-sm font-medium text-gray-300">Monthly Transaction Trend</h4>
                </div>
                <div className="h-48">
                    <Bar
                        data={{
                            labels: Object.keys(spendingAnalysis.monthlySpending).sort(),
                            datasets: [
                                {
                                    label: 'Deposits',
                                    data: Object.keys(spendingAnalysis.monthlySpending)
                                        .sort()
                                        .map(month => spendingAnalysis.monthlySpending[month].deposits),
                                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                                    borderColor: 'rgba(34, 197, 94, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Withdrawals',
                                    data: Object.keys(spendingAnalysis.monthlySpending)
                                        .sort()
                                        .map(month => spendingAnalysis.monthlySpending[month].withdrawals),
                                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                                    borderColor: 'rgba(239, 68, 68, 1)',
                                    borderWidth: 1
                                }
                            ]
                        }}
                        options={barChartOptions}
                    />
                </div>
            </div>

            {/* Spending Behavior Insights */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/40">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Spending Behavior Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Most used payment method:</span>
                            <span className="text-violet-300 font-medium">
                                {Object.entries(spendingAnalysis.paymentMethods)
                                    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Largest single withdrawal:</span>
                            <span className="text-red-300 font-medium">
                                {formatCurrency(Math.max(...transactions.map(tx => parseInt(tx["Withdrawal Amount"]) || 0)))}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Largest single deposit:</span>
                            <span className="text-green-300 font-medium">
                                {formatCurrency(Math.max(...transactions.map(tx => parseInt(tx["Deposit Amount"]) || 0)))}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Transaction frequency:</span>
                            <span className="text-blue-300 font-medium">
                                {(spendingAnalysis.transactionCount / 30).toFixed(1)} per month
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Spending pattern:</span>
                            <span className="text-purple-300 font-medium">
                                {spendingAnalysis.avgWithdrawal > spendingAnalysis.avgDeposit ? 'High spender' : 'Conservative'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Account health:</span>
                            <span className={`font-medium ${spendingAnalysis.netFlow >= 0 ? 'text-green-300' : 'text-yellow-300'}`}>
                                {spendingAnalysis.netFlow >= 0 ? 'Healthy' : 'Monitor'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};