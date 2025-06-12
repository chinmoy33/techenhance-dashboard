import React from 'react';
import { LoanApplicant } from '../../types/loan';
import { Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
interface StatsOverviewProps {
  applicants: LoanApplicant[];
  filteredApplicants: LoanApplicant[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ applicants, filteredApplicants }) => {
  
  //const [creditScore, setCreditScore] = React.useState<number>(0);
  const totalApplicants = filteredApplicants.length;
  const lowRiskCount = filteredApplicants.filter(a => a.risklevel === 'low').length;
  console.log('Filtered Applicants:', filteredApplicants);
  const avgCreditScore = Math.round(
    filteredApplicants.reduce((sum, a) => sum + a.creditscore, 0) / totalApplicants || 0
  );
  // useEffect(() => {
  //   setCreditScore(avgCreditScore);
  // },[]);
  //setCreditScore(avgCreditScore);
  const totalRequestedAmount = filteredApplicants.reduce((sum, a) => sum + a.requestedamount, 0);
  //console.log("average credit score:", creditScore);
  const stats = [
    {
      title: 'Total Applicants',
      value: totalApplicants.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    {
      title: 'Low Risk Candidates',
      value: lowRiskCount.toString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    {
      title: 'Avg Credit Score',
      value: avgCreditScore.toString(),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    },
    {
      title: 'Total Requested',
      value: `$${(totalRequestedAmount / 1000000).toFixed(1)}M`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};