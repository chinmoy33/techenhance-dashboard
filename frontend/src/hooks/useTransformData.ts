import { RecommendationData } from '../types/loan';

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
