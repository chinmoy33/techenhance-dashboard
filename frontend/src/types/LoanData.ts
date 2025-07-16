// export interface LoanData {
//   interested: string;
//   type_of_mutual_fund: string;
//   amount: number;
//   final_amount: number;
//   kyc_completed: boolean;
//   final_disbursed_amt: number;
// }
export interface LoanData {
  id: number;
  eligible_person_id: number;
  interested: string;
  type_of_mutual_fund: string;
  amount: number;
  final_amount: number;
  kyc_completed: boolean;
  final_disbursed_amt: number;
  created_at: string;

  eligible_mutualfunds_clients?: {
    person_name: string;
    account_number: string;
  };
}
