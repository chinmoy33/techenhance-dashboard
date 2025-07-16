import { RecommendationData } from '../types/loan';
import {LoanData} from '../types/LoanData'

export function useTransformData(rawData: any[]): RecommendationData[] {
  return rawData.map((raw) => ({
    id: raw.id,
    accountNumber: raw["Account Number"],
    accountType: raw["Account Type"],
    age: raw.Age,
    bankBranchName: raw["Bank Branch Name"],
    dateOfBirth: raw["Date of Birth"],
    education: raw.Education,
    eligible: raw.Eligible,
    emailAddress: raw["Email Address"],
    employmentType: raw["Employment Type"],
    income: raw.Income,
    loans: raw.Loans,
    maritalStatus: raw["Marital Status"],
    mutualFundsOrInvestments: raw["Mutual Funds or Investments"],
    onlineBankingEnabled: raw["Online Banking Enabled"],
    personsName: raw["Person's Name"],
    phoneNumber: raw["Phone Number"],
    smsBankingEnabled: raw["SMS Banking Enabled"],
  }));
}

export function useTransformLead(rawData: any[]): LoanData[] {
  return rawData.map((raw) => ({
    id: raw.id,
    eligible_person_id: raw.eligible_person_id,
    interested: raw.interested,
    type_of_mutual_fund: raw.type_of_mutual_fund,
    amount: raw.amount,
    final_amount: raw.final_amount,
    kyc_completed: raw.kyc_completed,
    final_disbursed_amt: raw.final_disbursed_amt,
    created_at: raw.created_at,
    eligible_mutualfunds_clients: raw.eligible_mutualfunds_clients
      ? {
          person_name: raw.eligible_mutualfunds_clients["Person's Name"],
          account_number: raw.eligible_mutualfunds_clients["Account Number"],
        }
      : undefined,
  }));
}
