import { RecommendationData } from '../types/loan';

export function scoreApplicant(applicant: RecommendationData): number {
  let score = 0;

  // Same scoring logic...
  score += Math.min(applicant.income / 10000, 10);

  const employmentWeights: Record<string, number> = {
    Govt: 10,
    Private: 7,
    "Self-employed": 5,
    Unemployed: 2,
  };
  score += employmentWeights[applicant.employmentType] ?? 3;

  const educationWeights: Record<string, number> = {
    PhD: 10,
    Masters: 8,
    Graduate: 6,
    Undergraduate: 4,
    None: 1,
  };
  score += educationWeights[applicant.education] ?? 3;

  if (applicant.age >= 25 && applicant.age <= 55) score += 5;

  if (applicant.loans === 'None' || applicant.loans === '') score += 5;
  else score -= 3;

  if (applicant.mutualFundsOrInvestments !== 'No Investments') score += 4;
  if (applicant.onlineBankingEnabled === 'Yes') score += 2;
  if (applicant.smsBankingEnabled === 'Yes') score += 1;
  if (applicant.maritalStatus === 'Married') score += 1;

  return score;
}