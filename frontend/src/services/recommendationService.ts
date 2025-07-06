// src/services/recommendationService.ts
import axios from "axios";
import { LoanApplicant } from "../types/loan";

const recommendationApi = axios.create({
  baseURL: "http://localhost:3002", // direct microservice URL
});

export const recommendationService = {
  async getRecommendations(): Promise<LoanApplicant[]> {
    const response = await recommendationApi.get("/api/recommendations");
    return response.data;
  },
};
