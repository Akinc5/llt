import { supabase } from '../lib/supabase';
import { Loan } from '../types';

export async function getLoansByBorrower(borrowerId: string): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('borrower_id', borrowerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllLoans(): Promise<Loan[]> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getLoanById(id: string): Promise<Loan | null> {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createLoan(loan: Omit<Loan, 'id' | 'created_at' | 'updated_at'>): Promise<Loan> {
  const { data, error } = await supabase
    .from('loans')
    .insert([loan])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
  const { data, error } = await supabase
    .from('loans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLoanStats() {
  const { data: activeLoans, error: activeError } = await supabase
    .from('loans')
    .select('principal_amount')
    .eq('status', 'active');

  const { data: totalLoans, error: totalError } = await supabase
    .from('loans')
    .select('principal_amount');

  const { data: completedLoans, error: completedError } = await supabase
    .from('loans')
    .select('principal_amount')
    .eq('status', 'completed');

  if (activeError || totalError || completedError) {
    throw activeError || totalError || completedError;
  }

  return {
    activeLoanCount: activeLoans?.length || 0,
    activeLoanAmount: activeLoans?.reduce((sum, loan) => sum + parseFloat(loan.principal_amount as any), 0) || 0,
    totalLoanCount: totalLoans?.length || 0,
    completedLoanCount: completedLoans?.length || 0,
  };
}
