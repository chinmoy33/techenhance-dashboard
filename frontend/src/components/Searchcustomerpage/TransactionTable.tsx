import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Hash } from 'lucide-react';
import { TransactionData } from '../../types/searchcustomerpage';

interface TransactionTableProps {
    transactions: Array<{
        data: TransactionData;
        timestamp: string;
    }>;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    // Format string amount as INR currency with no decimal digits
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(parseInt(amount));
    };

    // Determine whether this transaction is a credit (deposit > withdrawal)
    const isCredit = (data: TransactionData) => {
        const depositAmount = parseInt(data["Deposit Amount"]);
        const withdrawalAmount = parseInt(data["Withdrawal Amount"]);
        return depositAmount > withdrawalAmount;
    };

    return (
        <div className="bg-gradient-to-br from-emerald-900/60 to-green-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-600/50 overflow-hidden">
            {/* Table Container with horizontal scroll for mobile */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    {/* Table Header */}
                    <thead className="bg-gray-800/80 border-b border-emerald-600/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Transaction</span>
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date</span>
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                Deposit
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                Withdrawal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                Balance
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <Hash className="h-4 w-4" />
                                    <span>Reference</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-600/50">
                        {transactions.map((transaction, index) => {
                            const { data, timestamp } = transaction;
                            const creditTransaction = isCredit(data);

                            return (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-700/30 transition-colors duration-200"
                                >
                                    {/* Transaction Info Column */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${creditTransaction ? 'bg-green-500/20 border-green-400/30' : 'bg-red-500/20 border-red-400/30'} border`}>
                                                {creditTransaction ? (
                                                    <ArrowDownLeft className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <ArrowUpRight className="h-4 w-4 text-red-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{data["Person's Name"]}</p>
                                                <p className="text-xs text-gray-400">{data["Digital Presence"]}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date Column */}
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="text-sm text-gray-200">{data["Date"]}</p>
                                            <p className="text-xs text-gray-400">Value: {data["Value Date"]}</p>
                                        </div>
                                    </td>

                                    {/* Deposit Column */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center space-x-1">
                                            <ArrowDownLeft className="h-3 w-3 text-green-400" />
                                            <span className="text-sm font-semibold text-green-400">
                                                {formatCurrency(data["Deposit Amount"])}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Withdrawal Column */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center space-x-1">
                                            <ArrowUpRight className="h-3 w-3 text-red-400" />
                                            <span className="text-sm font-semibold text-red-400">
                                                {formatCurrency(data["Withdrawal Amount"])}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Balance Column */}
                                    <td className="px-4 py-4">
                                        <span className="text-sm font-semibold text-blue-400">
                                            {formatCurrency(data["Balance Amount"])}
                                        </span>
                                    </td>

                                    {/* Transaction Details Column */}
                                    <td className="px-4 py-4 max-w-xs">
                                        <p className="text-sm text-gray-200 truncate" title={data["Transaction Details"]}>
                                            {data["Transaction Details"]}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            ID: {data["Transaction Number or ID"]}
                                        </p>
                                    </td>

                                    {/* Reference Column */}
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="text-sm text-gray-200">CHQ: {data["CHQ.NO"]}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Table Summary Footer */}
            <div className="bg-gray-800/60 border-t border-emerald-600/50 px-4 py-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <p className="text-sm text-gray-300">
                        Total Transactions: <span className="font-semibold text-emerald-300">{transactions.length}</span>
                    </p>
                    <div className="flex space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                            <ArrowDownLeft className="h-3 w-3 text-green-400" />
                            <span>Credits</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <ArrowUpRight className="h-3 w-3 text-red-400" />
                            <span>Debits</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};