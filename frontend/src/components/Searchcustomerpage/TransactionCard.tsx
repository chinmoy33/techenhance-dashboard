import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Hash } from 'lucide-react';
import { TransactionData } from '../../types/searchcustomerpage'; // Adjust the import path as necessary

interface TransactionCardProps {
  data: TransactionData;
  timestamp: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ data, timestamp }) => {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  const depositAmount = parseInt(data["Deposit Amount"]);
  const withdrawalAmount = parseInt(data["Withdrawal Amount"]);
  const isCredit = depositAmount > withdrawalAmount;

  return (
    <div className="bg-gradient-to-br from-emerald-900/60 to-green-800/60 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-600/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/20 rounded-lg border border-green-400/30">
            <CreditCard className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{data["Person's Name"]}</h3>
            <p className="text-sm text-gray-400">Transaction Record</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-400/30">
          Transaction
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
          {isCredit ? (
            <ArrowDownLeft className="h-5 w-5 text-green-400" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-red-400" />
          )}
          <div>
            <p className="text-xs text-gray-400">Deposit</p>
            <p className="text-sm font-bold text-green-400">{formatCurrency(data["Deposit Amount"])}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
          <ArrowUpRight className="h-5 w-5 text-red-400" />
          <div>
            <p className="text-xs text-gray-400">Withdrawal</p>
            <p className="text-sm font-bold text-red-400">{formatCurrency(data["Withdrawal Amount"])}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
          <CreditCard className="h-5 w-5 text-blue-400" />
          <div>
            <p className="text-xs text-gray-400">Balance</p>
            <p className="text-sm font-bold text-blue-400">{formatCurrency(data["Balance Amount"])}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Transaction Date</p>
              <p className="text-sm font-medium text-gray-200">{data["Date"]}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Hash className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Cheque Number</p>
              <p className="text-sm font-medium text-gray-200">{data["CHQ.NO"]}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-600/50">
          <p className="text-xs text-gray-400 mb-1">Transaction Details</p>
          <p className="text-sm text-gray-200">{data["Transaction Details"]}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/30">
          <p className="text-gray-400">Payment Method</p>
          <p className="font-medium text-gray-200">{data["Digital Presence"]}</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/30">
          <p className="text-gray-400">Transaction ID</p>
          <p className="font-medium text-gray-200">{data["Transaction Number or ID"]}</p>
        </div>
        <div className="bg-gray-800/50 rounded p-2 border border-gray-600/30">
          <p className="text-gray-400">Account</p>
          <p className="font-medium text-gray-200">{data["Account Number"]}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600/50 flex justify-between items-center text-xs text-gray-400">
        <span>Value Date: {data["Value Date"]}</span>
        <span>Recorded: {new Date(timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};