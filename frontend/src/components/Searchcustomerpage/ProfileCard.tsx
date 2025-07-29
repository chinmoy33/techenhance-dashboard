import React from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { ProfileData } from '../../types/searchcustomerpage';

interface ProfileCardProps {
  data: ProfileData;
  timestamp: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ data, timestamp }) => {
  // Format currency in Indian Rupees format without decimal
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parseInt(amount));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-600/50">

      {/* Header with user icon and title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <User className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{data["Person's Name"]}</h3>
            <p className="text-xs text-gray-400">Profile Information</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-medium rounded-full border border-blue-400/30">
          Profile
        </span>
      </div>

      {/* Main grid of profile details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        {/* Email */}
        <div className="flex items-center space-x-2">
          <Mail className="h-3.5 w-3.5 text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-200">{data["Email Address"]}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-2">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-500">Phone</p>
            <p className="text-sm font-medium text-gray-200">{data["Phone Number"]}</p>
          </div>
        </div>

        {/* Age */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-500">Age</p>
            <p className="text-sm font-medium text-gray-200">{data["Age"]} yrs</p>
          </div>
        </div>

        {/* Employment */}
        <div className="flex items-center space-x-2">
          <Building className="h-3.5 w-3.5 text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-500">Employment</p>
            <p className="text-sm font-medium text-gray-200">{data["Employment Type"]}</p>
          </div>
        </div>

        {/* Account Type */}
        <div className="flex items-center space-x-2">
          <CreditCard className="h-3.5 w-3.5 text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-500">Account Type</p>
            <p className="text-sm font-medium text-gray-200">{data["Account Type"]}</p>
          </div>
        </div>

        {/* Income */}
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
          <div>
            <p className="text-[10px] text-gray-500">Annual Income</p>
            <p className="text-sm font-medium text-gray-200">{formatCurrency(data["Income"])}</p>
          </div>
        </div>
      </div>

      {/* Bottom compact stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-700/40 rounded-lg border border-gray-600/40">
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Education</p>
          <p className="text-sm font-medium text-gray-200">{data["Education"]}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Marital Status</p>
          <p className="text-sm font-medium text-gray-200">{data["Marital Status"]}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Online Banking</p>
          <p className={`text-sm font-medium ${data["Online Banking Enabled"] === "Yes" ? "text-green-400" : "text-red-400"}`}>
            {data["Online Banking Enabled"]}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-400">Investments</p>
          <p className="text-sm font-medium text-gray-200">{data["Mutual Funds or Investments"]}</p>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-3 border-t border-gray-600/40 flex justify-between items-center text-[10px] text-gray-400">
        <span>Account: {data["Account Number"]}</span>
        <span>Updated: {new Date(timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
