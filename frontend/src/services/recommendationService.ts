// src/services/recommendationService.ts
import axios from "axios";
import { LoanApplicant } from "../types/loan";
import { LoanData} from "../types/LoanData"

const recommendationApi = axios.create({
  baseURL: "http://localhost:3002", // direct microservice URL
});

interface updateLeadResponse {
  success:boolean,
  message:string,
};

interface formDatatype{
  interested:boolean,
  type_of_mutual_fund:string,
  amount:number,
  final_amount:number,
  kyc_completed:boolean,
  final_disbursed_amt:number,
};

export const recommendationService = {
  async getRecommendations(): Promise<LoanApplicant[]> {
    const response = await recommendationApi.get("/api/recommendations");
    return response.data;
  },
  async getLeads(): Promise<LoanData[]> {
    const response = await recommendationApi.get("/api/recommendations/leadtracking");
    return response.data;
  },
  async updateLeads(id:number,formData:formDatatype): Promise<updateLeadResponse> {
    const response = await recommendationApi.post(`/api/recommendations/updateLeads/${id}`,formData);
    return response.data
  }
};
