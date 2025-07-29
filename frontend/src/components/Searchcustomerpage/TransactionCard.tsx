import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Hash } from 'lucide-react';
import { TransactionData } from '../../types/searchcustomerpage';

interface TransactionCardProps {
  data: TransactionData;
  timestamp: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ data, timestamp }) => {
  // Format string amount as INR currency with no decimal digits
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  // Determine whether this transaction is a credit (deposit > withdrawal)
  const depositAmount = parseInt(data["Deposit Amount"]);
  const withdrawalAmount = parseInt(data["Withdrawal Amount"]);
  const isCredit = depositAmount > withdrawalAmount;

  return (
    <div className="bg-gradient-to-br from-emerald-900/60 to-green-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-600/50">

      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-green-500/20 rounded-lg border border-green-400/30">
            <CreditCard className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{data["Person's Name"]}</h3>
            <p className="text-xs text-gray-400">Transaction Record</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] font-medium rounded-full border border-green-400/30">
          Transaction
        </span>
      </div>

      {/* Transaction Summary: Deposit, Withdrawal, Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md border border-gray-600/50">
          {isCredit ? (
            <ArrowDownLeft className="h-4 w-4 text-green-400" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-red-400" />
          )}
          <div>
            <p className="text-[11px] text-gray-400">Deposit</p>
            <p className="text-sm font-semibold text-green-400">{formatCurrency(data["Deposit Amount"])}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md border border-gray-600/50">
          <ArrowUpRight className="h-4 w-4 text-red-400" />
          <div>
            <p className="text-[11px] text-gray-400">Withdrawal</p>
            <p className="text-sm font-semibold text-red-400">{formatCurrency(data["Withdrawal Amount"])}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md border border-gray-600/50">
          <CreditCard className="h-4 w-4 text-blue-400" />
          <div>
            <p className="text-[11px] text-gray-400">Balance</p>
            <p className="text-sm font-semibold text-blue-400">{formatCurrency(data["Balance Amount"])}</p>
          </div>
        </div>
      </div>

      {/* Transaction Details Section */}
      <div className="bg-gray-700/50 rounded-md p-3 border border-gray-600/50 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-[11px] text-gray-400">Transaction Date</p>
              <p className="text-sm text-gray-200">{data["Date"]}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-[11px] text-gray-400">Cheque Number</p>
              <p className="text-sm text-gray-200">{data["CHQ.NO"]}</p>
            </div>
          </div>
        </div>

        {/* Optional Transaction Details Text */}
        <div className="mt-2 pt-2 border-t border-gray-600/50">
          <p className="text-[11px] text-gray-400 mb-0.5">Transaction Details</p>
          <p className="text-sm text-gray-200">{data["Transaction Details"]}</p>
        </div>
      </div>

      {/* Additional Metadata (without account number as requested) */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/30">
          <p className="text-gray-400 text-[11px]">Payment Method</p>
          <p className="font-medium text-gray-200 text-sm">{data["Digital Presence"]}</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/30">
          <p className="text-gray-400 text-[11px]">Transaction ID</p>
          <p className="font-medium text-gray-200 text-sm">{data["Transaction Number or ID"]}</p>
        </div>
      </div>

      {/* Footer: Value date and timestamp */}
      <div className="mt-3 pt-3 border-t border-gray-600/50 flex justify-between items-center text-[11px] text-gray-400">
        <span>Value Date: {data["Value Date"]}</span>
        <span>Recorded: {new Date(timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
