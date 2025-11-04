import { supabase } from '../lib/supabase';
import { Borrower } from '../types';

export async function getBorrowers(): Promise<Borrower[]> {
  const { data, error } = await supabase
    .from('borrowers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBorrowerById(id: string): Promise<Borrower | null> {
  const { data, error } = await supabase
    .from('borrowers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createBorrower(borrower: Omit<Borrower, 'id' | 'created_at' | 'updated_at'>): Promise<Borrower> {
  const { data, error } = await supabase
    .from('borrowers')
    .insert([borrower])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBorrower(id: string, updates: Partial<Borrower>): Promise<Borrower> {
  const { data, error } = await supabase
    .from('borrowers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBorrower(id: string): Promise<void> {
  const { error } = await supabase
    .from('borrowers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
