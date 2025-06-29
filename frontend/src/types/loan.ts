export interface LoanApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  salary: number;
  creditscore: number;
  employmentyears: number;
  loantype: LoanType;
  requestedamount: number;
  risklevel: RiskLevel;
  employmenttype: string;
  monthlyexpenses: number;
  assets: number;
  previousloans: number;
  avatar: string;
}

export type LoanType = 'car' | 'house' | 'education' | 'business' | 'personal';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface FilterOptions {
  search: string;
  loantype: LoanType | 'all';
  minSalary: number;
  maxSalary: number;
  risklevel: RiskLevel | 'all';
}

export interface RecommendationData {
  id: number;
  accountNumber: string;
  accountType: string;
  age: number;
  bankBranchName: string;
  dateOfBirth: string;
  education: string;
  eligible: "Yes" | "No";
  emailAddress: string;
  employmentType: string;
  income: number;
  loans: string;
  maritalStatus: string;
  mutualFundsOrInvestments: string;
  onlineBankingEnabled: "Yes" | "No";
  personsName: string;
  phoneNumber: string;
  smsBankingEnabled: "Yes" | "No";
}
