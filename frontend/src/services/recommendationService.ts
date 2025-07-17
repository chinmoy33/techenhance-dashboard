// src/services/recommendationService.ts
import axios from "axios";
import { LoanApplicant } from "../types/loan";

const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? "http://localhost:3002" // for local dev with Nginx proxy (Docker)
    : 'https://recommendation-service-r2gb.onrender.com'; // for production

const recommendationApi = axios.create({
  baseURL: API_BASE_URL, // direct microservice URL
});

export const recommendationService = {
  async getRecommendations(): Promise<LoanApplicant[]> {
    const response = await recommendationApi.get("/api/recommendations");
    return response.data;
  },
};
