import React from 'react';
import { LoanApplicant } from '../../types/loan';
import { 
  User, 
  Phone, 
  Mail, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Car,
  Home,
  CreditCard,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LoanApplicantCardProps {
  applicant: LoanApplicant;
}

export const LoanApplicantCard: React.FC<LoanApplicantCardProps> = ({ applicant }) => {
  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'house': return <Home className="w-4 h-4" />;
      case 'personal': return <CreditCard className="w-4 h-4" />;
      case 'business': return <Briefcase className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'high': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'car': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'house': return 'bg-purple-900/30 text-purple-300 border-purple-700';
      case 'personal': return 'bg-indigo-900/30 text-indigo-300 border-indigo-700';
      case 'business': return 'bg-emerald-900/30 text-emerald-300 border-emerald-700';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };
  //console.log("Applicant data:", applicant.monthlyExpenses, applicant.salary);
  const debtToIncomeRatio = ((applicant.monthlyexpenses / (applicant.salary / 12)) * 100).toFixed(1);
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={applicant.avatar}
          alt={applicant.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{applicant.name}</h3>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <User className="w-4 h-4" />
            <span>{applicant.age} years old</span>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getRiskColor(applicant.risklevel)}`}>
              {getRiskIcon(applicant.risklevel)}
              {applicant.risklevel.toUpperCase()} RISK
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getLoanTypeColor(applicant.loantype)}`}>
              {getLoanTypeIcon(applicant.loantype)}
              {applicant.loantype.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Annual Salary</span>
          </div>
          <p className="text-white font-semibold">${applicant.salary.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Credit Score</span>
          </div>
          <p className="text-white font-semibold">{applicant.creditscore}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Calendar className="w-4 h-4" />
            <span>Experience</span>
          </div>
          <p className="text-white font-semibold">{applicant.employmentyears} years</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Debt-to-Income</span>
          </div>
          <p className="text-white font-semibold">{debtToIncomeRatio}%</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
        <p className="text-slate-400 text-sm mb-1">Requested Amount</p>
        <p className="text-2xl font-bold text-white">${applicant.requestedamount.toLocaleString()}</p>
        
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
        <a
          href={`mailto:${applicant.email}`}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </a>
        <a
          href={`tel:${applicant.phone}`}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Call</span>
        </a>
        <div className="ml-auto">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Review Application
          </button>
        </div>
      </div>
    </div>
  );
};