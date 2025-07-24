import React from 'react';
import { LoanData } from '../../types/LoanData';
import { TrendingDown, Users, FileCheck, CreditCard, DollarSign } from 'lucide-react';

interface LoanFunnelProps {
  data: LoanData[];
}

const LoanFunnel: React.FC<LoanFunnelProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }
  const totalApplications = data.length;
  const interestedUsers = data.filter(item => item.interested=="yes" || item.interested=="Yes").length;
  const kycCompleted = data.filter(item => item.kyc_completed).length;
  const finalDisbursed = data.filter(item => item.final_disbursed_amt > 0).length;
  
  const totalRequestedAmount = data.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  //const totalFinalAmount = data.reduce((sum, item) => sum + (item.final_amount ?? 0), 0);
  const totalDisbursedAmount = data.reduce((sum, item) => sum + (item.final_disbursed_amt ?? 0), 0);
  
  const conversionRate = (finalDisbursed / totalApplications) * 100;
  
  const funnelStages = [
    {
      title: 'Total Applications',
      count: totalApplications,
      percentage: 100,
      color: 'bg-blue-500',
      icon: Users
    },
    {
      title: 'Interested Users',
      count: interestedUsers,
      percentage: (interestedUsers / totalApplications) * 100,
      color: 'bg-green-500',
      icon: TrendingDown
    },
    {
      title: 'KYC Completed',
      count: kycCompleted,
      percentage: (kycCompleted / totalApplications) * 100,
      color: 'bg-yellow-500',
      icon: FileCheck
    },
    {
      title: 'Final Disbursed',
      count: finalDisbursed,
      percentage: (finalDisbursed / totalApplications) * 100,
      color: 'bg-purple-500',
      icon: CreditCard
    }
  ];

  return (
    <div className="sm:w-[90vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* Funnel Visualization */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 justify-items-stretch">
        <h3 className="text-lg font-semibold text-white mb-4">Application Journey</h3>
        <div className="">
          {funnelStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={index} className="relative ">
                <div className="flex items-center space-x-4">
                  <div className={`${stage.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">{stage.title}</h4>
                      <span className="text-gray-300 text-sm">
                        {stage.count} users ({stage.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${stage.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {index < funnelStages.length - 1 && (
                  <div className="ml-6 mt-2 mb-2 w-0.5 h-6 bg-gray-600"></div>
                )}
                
              </div>
              
            );
          })}
          <div className="bg-gray-700 rounded-lg shadow-xl p-6 mt-4">
                <h2 className="text-xl font-semibold text-white mb-2">Fund Funnel Analysis</h2>
                <p className="text-gray-300 text-sm">Conversion rate: {conversionRate.toFixed(1)}%</p>
          </div>
          
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Financial Overview
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 justify-items-stretch">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Total Requested</span>
              <span className="text-white font-semibold">₹{totalRequestedAmount.toLocaleString()}</span>
            </div>
          </div>
          {/* <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Total Approved</span>
              <span className="text-white font-semibold">₹{totalFinalAmount.toLocaleString()}</span>
            </div>
          </div> */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Total Disbursed</span>
              <span className="text-white font-semibold">₹{totalDisbursedAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Disbursement Rate</span>
                <span className="text-green-400 font-semibold">
                {totalRequestedAmount === 0
                    ? '0.0%'
                    : `${((totalDisbursedAmount / totalRequestedAmount) * 100).toFixed(1)}%`}
                </span>
            </div>
          </div>

        </div>
      </div>

<div className="bg-gray-800 rounded-lg shadow-xl p-6">
  <h3 className="text-lg font-semibold text-white mb-4">Mutual Fund Distribution</h3>
  <div className="space-y-3">
    {['SIP', 'biannually', 'annually'].map(fundType => {
      const count = data.filter(item => item.type_of_mutual_fund?.trim() === fundType).length;
      const percentage = totalApplications === 0 ? 0 : (count / totalApplications) * 100;

      return (
        <div key={fundType} className="flex justify-between items-center">
          <span className="text-gray-300">{fundType}</span>
          <div className="flex items-center">
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-white text-sm w-12 text-right">{count}</span>
          </div>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
};

export default LoanFunnel;