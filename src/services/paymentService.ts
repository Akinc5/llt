import { supabase } from '../lib/supabase';
import { Payment } from '../types';

export async function getPaymentsByLoan(loanId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('loan_id', loanId)
    .order('payment_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentPayments(days: number = 30): Promise<Payment[]> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .gte('payment_date', fromDate.toISOString().split('T')[0])
    .order('payment_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getTotalPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('amount');

  if (error) throw error;

  return data?.reduce((sum, payment) => sum + parseFloat(payment.amount as any), 0) || 0;
}
