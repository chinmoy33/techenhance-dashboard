import { useMemo } from 'react';
import { RecommendationData } from '../types/loan';
import { scoreApplicant } from '../utils/ScoreApplicants';

export function useSortApplicants(applicants: RecommendationData[]): RecommendationData[] {
  return useMemo(() => {
    return [...applicants].sort((a, b) => scoreApplicant(b) - scoreApplicant(a));
  }, [applicants]);
}
