export interface DatabaseRecord {
  id: number;
  name: string;
  data: TransactionData | ProfileData;
  type: 'transaction' | 'profile';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionData {
  "Date": string;
  "CHQ.NO": string;
  "Value Date": string;
  "Person's Name": string;
  "Account Number": string;
  "Balance Amount": string;
  "Deposit Amount": string;
  "Digital Presence": string;
  "Withdrawal Amount": string;
  "Transaction Details": string;
  "Transaction Number or ID": string;
}

export interface ProfileData {
  "Age": string;
  "Loans": string;
  "Income": string;
  "Education": string;
  "Account Type": string;
  "Phone Number": string;
  "Date of Birth": string;
  "Email Address": string;
  "Person's Name": string;
  "Account Number": string;
  "Marital Status": string;
  "Employment Type": string;
  "Bank Branch Name": string;
  "SMS Banking Enabled": string;
  "Online Banking Enabled": string;
  "Mutual Funds or Investments": string;
}