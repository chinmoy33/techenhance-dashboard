import React from 'react';
import { User, Mail, Phone, Calendar, Building, CreditCard, TrendingUp } from 'lucide-react';
import { ProfileData } from '../../types/searchcustomerpage';

interface ProfileCardProps {
  data: ProfileData;
  timestamp: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ data, timestamp}) => {

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-600/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{data["Person's Name"]}</h3>
            <p className="text-sm text-gray-400">Profile Information</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-400/30">
          Profile
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-200">{data["Email Address"]}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-200">{data["Phone Number"]}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Age</p>
            <p className="text-sm font-medium text-gray-200">{data["Age"]} years</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Building className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Employment</p>
            <p className="text-sm font-medium text-gray-200">{data["Employment Type"]}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Account Type</p>
            <p className="text-sm font-medium text-gray-200">{data["Account Type"]}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Annual Income</p>
            <p className="text-sm font-medium text-gray-200">{formatCurrency(data["Income"])}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
        <div className="text-center">
          <p className="text-xs text-gray-400">Education</p>
          <p className="text-sm font-medium text-gray-200">{data["Education"]}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Marital Status</p>
          <p className="text-sm font-medium text-gray-200">{data["Marital Status"]}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Online Banking</p>
          <p className={`text-sm font-medium ${data["Online Banking Enabled"] === "Yes" ? "text-green-400" : "text-red-400"}`}>
            {data["Online Banking Enabled"]}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Investments</p>
          <p className="text-sm font-medium text-gray-200">{data["Mutual Funds or Investments"]}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600/50 flex justify-between items-center text-xs text-gray-400">
        <span>Account: {data["Account Number"]}</span>
        <span>Updated: {new Date(timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};