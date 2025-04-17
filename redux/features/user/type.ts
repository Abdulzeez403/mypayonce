export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  balance: number;
  account?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    virtualAccountId: string;
  };
}
