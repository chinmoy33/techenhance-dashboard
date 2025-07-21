import React from 'react';
import { RecommendationData } from '../../types/loan';
import { scoreApplicant } from '../../utils/ScoreApplicants';
import  ContactForm  from "./ContactForm.tsx"
import {recommendationService} from "../../services/recommendationService.ts"
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
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
  AlertCircle,
  Cake,
  Filter,
} from 'lucide-react';
import { setHasClicked } from "../../store/leadSlice";
import { RootState } from "../../store";

interface RecommendedApplicantProps {
  applicant: RecommendationData;
}

export const LoanApplicantCard: React.FC<RecommendedApplicantProps> = ({ applicant }) => {
  const score = scoreApplicant(applicant);
  const [showForm, setShowForm] = React.useState(false);
  const dispatch = useDispatch();
  const hasClicked = useSelector(
        (state: RootState) => state.lead.hasClicked
      );

  const getRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score >= 35) return "low";
  if (score >= 20) return "medium";
  return "high";
};

  const riskLevel = getRiskLevel(score);
  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'Car Loan': return <Car className="w-4 h-4" />;
      case 'House Loan': return <Home className="w-4 h-4" />;
      case 'Education Loan': return <CreditCard className="w-4 h-4" />;
      case 'Business Loan': return <Briefcase className="w-4 h-4" />;
      case 'Personal Loan': return <User className="w-4 h-4" />;
      case 'No Loan': return <CheckCircle className="w-4 h-4 text-emerald-500" />
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
      case 'Car Loan': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'House Loan': return 'bg-purple-900/30 text-purple-300 border-purple-700';
      case 'Education Loan': return 'bg-indigo-900/30 text-indigo-300 border-indigo-700';
      case 'Business Loan': return 'bg-emerald-900/30 text-emerald-300 border-emerald-700';
      case 'Personal Loan': return 'bg-orange-900/30 text-orange-300 border-orange-700';
      case 'No Loan':  return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };
  
  const handleFilterClick=()=>{
    dispatch(setHasClicked(!hasClicked));
  }
  
  return (
    
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex gap-4 mb-4">
        <button
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
          onClick={() => setShowForm(true)}
        >
          Mark as Contacted
        </button>
        <button onClick={handleFilterClick}>
          <Filter className="w-5 h-5 mt-1 cursor-pointer hover:text-blue-400"/>
        </button>
        
      </div>

      {showForm && (
        <ContactForm
          onSubmit={async(formData) => {
            console.log('Form Data Submitted:', formData);
            // TODO: POST to Supabase here
            try{
              const {success,message}=await recommendationService.updateLeads(applicant.id,formData);
              if(success)
              {
                toast.success(message);
              }
              else
              {
                toast.error(message)
              }
              
            }
            catch(error)
            {
              console.error("error occured while updating Leads!");
            }
            finally{
               setShowForm(false);
            }
           
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="flex items-start gap-4 mb-4">
        {/* <img
          src={applicant.avatar}
          alt={applicant.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
        /> */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white mb-1">{applicant.personsName}</h3>
              <span className="text-xs text-gray-400">Account No: {applicant.accountNumber}</span>
          </div>
          

          <div className="flex items-center justify-between text-slate-400 text-sm mb-4 mt-2">
            <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{applicant.age} years old</span>
            </div>
            <div className="flex items-center gap-2">
               <Cake className="w-4 h-4" />
                <span>
                  D.O.B:{' '}
                  {new Date(applicant.dateOfBirth).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
            </div>
            

          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getRiskColor(riskLevel)}`}>
             {getRiskIcon(riskLevel)}
             {riskLevel.toUpperCase()} RISK
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getLoanTypeColor(applicant.loans)}`}>
              {getLoanTypeIcon(applicant.loans)}
              {applicant.loans.toUpperCase()}
            </span>
            {/* <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getLoanTypeColor(applicant.accountType)}`}>
              {getLoanTypeIcon(applicant.loans)}
              {applicant.accountType.toUpperCase()}
            </span> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-1 text-slate-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Income</span>
          </div>
          <p className="text-white font-semibold">${applicant.income.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Account Type</span>
          </div>
          <p className="text-white font-semibold">{applicant.accountType}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Calendar className="w-4 h-4" />
            <span>Employee type</span>
          </div>
          <p className="text-white font-semibold">{applicant.employmentType.toUpperCase()}</p>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Bank Branch</span>
          </div>
          <p className="text-white font-semibold">{applicant.bankBranchName}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
        <p className="text-slate-400 text-sm mb-1">Proposed Amount</p>
        <p className="text-2xl font-bold text-white">${applicant.income.toLocaleString()}</p>
        
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
        <div className="text-center">
          <p className="text-xs text-gray-400">Education</p>
          <p className="text-sm font-medium text-gray-200">{applicant.education}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Marital Status</p>
          <p className="text-sm font-medium text-gray-200">{applicant.maritalStatus}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Online Banking</p>
          <p className={`text-sm font-medium ${applicant.onlineBankingEnabled === "Yes" ? "text-green-400" : "text-red-400"}`}>
            {applicant.onlineBankingEnabled}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Investments</p>
          <p className="text-sm font-medium text-gray-200">{applicant.mutualFundsOrInvestments}</p>
        </div>
      </div>


      <div className="flex items-center gap-4 pt-4 border-t border-slate-700 flex-wrap">
        <a
          href={`mailto:${applicant.emailAddress}`}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm hover:underline"
        >
          <Mail className="w-4 h-4" />
          <span>Email- <span className="break-all">{applicant.emailAddress}</span></span>
        </a>
        <a
          href={`tel:${applicant.phoneNumber}`}
          className="break-words flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm hover:underline"
        >
          <Phone className="w-4 h-4" />
          <span>Call- <span className="break-all">{applicant.phoneNumber}</span></span>
        </a>
        {/* <div className="ml-auto">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Review Application
          </button>
        </div> */}
      </div>
    </div>
  );
};