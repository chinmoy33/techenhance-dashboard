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

export type LoanType = 'car' | 'house' | 'personal' | 'business';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface FilterOptions {
  search: string;
  loantype: LoanType | 'all';
  minSalary: number;
  maxSalary: number;
  risklevel: RiskLevel | 'all';
}