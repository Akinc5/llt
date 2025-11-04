export interface Borrower {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  status: 'active' | 'inactive' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  borrower_id: string;
  principal_amount: number;
  interest_rate: number;
  loan_term_months: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'defaulted';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  loan_id: string;
  payment_date: string;
  amount: number;
  principal_amount: number;
  interest_amount: number;
  payment_method: string;
  notes?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
