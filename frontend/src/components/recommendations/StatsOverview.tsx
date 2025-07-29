import React from 'react';
import { RecommendationData } from '../../types/loan';
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Info
} from 'lucide-react';
import { scoreApplicant } from '../../utils/ScoreApplicants';
import { useEffect } from 'react';
interface StatsOverviewProps {
  applicants: RecommendationData[];
  filteredApplicants: RecommendationData[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ applicants, filteredApplicants }) => {

  //const [creditScore, setCreditScore] = React.useState<number>(0);
  const totalApplicants = filteredApplicants.length;
  //const lowRiskCount = filteredApplicants.filter(a => a.risklevel === 'low').length;
  const lowRiskCount = filteredApplicants.filter((applicant) => scoreApplicant(applicant) >= 35).length;

  const avgIncome = Math.round(
    filteredApplicants.reduce((sum, a) => sum + a.income, 0) / totalApplicants || 0
  );
  // useEffect(() => {
  //   setCreditScore(avgCreditScore);
  // },[]);
  //setCreditScore(avgCreditScore);
  const totalRequestedAmount = filteredApplicants.reduce((sum, a) => sum + a.income, 0);
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
      bgColor: 'bg-green-900/20',
      info: `Actual recommendations are made by the Machine Learning model. This tile adds an extra filtering layer to estimate the risk of the recommended candidates.`
    },
    {
      title: 'Avg Income',
      value: avgIncome.toString(),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    },
    {
      title: 'Proposed Loan Amount',
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
              <p className="text-slate-400 text-sm font-medium flex items-center gap-1">
                {stat.title}
                {stat.info && (
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 p-2 bg-gray-900 text-xs text-gray-200 rounded shadow-lg border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {stat.info}
                    </div>
                  </div>
                )}
              </p>
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