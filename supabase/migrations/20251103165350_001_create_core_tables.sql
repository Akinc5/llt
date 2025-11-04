/*
  # Loan Management System - Core Tables

  1. New Tables
    - `borrowers`: Stores borrower information
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `occupation` (text)
      - `status` (text: active, inactive, closed)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `loans`: Stores loan details
      - `id` (uuid, primary key)
      - `borrower_id` (uuid, foreign key)
      - `principal_amount` (numeric)
      - `interest_rate` (numeric)
      - `loan_term_months` (integer)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (text: active, completed, defaulted)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `payments`: Tracks loan payments
      - `id` (uuid, primary key)
      - `loan_id` (uuid, foreign key)
      - `payment_date` (date)
      - `amount` (numeric)
      - `principal_amount` (numeric)
      - `interest_amount` (numeric)
      - `payment_method` (text)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies for staff/admin access to borrower and loan data
    - Policies for viewing payment history
*/

CREATE TABLE IF NOT EXISTS borrowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  occupation text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id uuid NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
  principal_amount numeric(12,2) NOT NULL,
  interest_rate numeric(5,2) NOT NULL,
  loan_term_months integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  payment_date date NOT NULL,
  amount numeric(12,2) NOT NULL,
  principal_amount numeric(12,2) NOT NULL,
  interest_amount numeric(12,2) NOT NULL,
  payment_method text DEFAULT 'cash',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view borrowers"
  ON borrowers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert borrowers"
  ON borrowers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update borrowers"
  ON borrowers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view loans"
  ON loans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert loans"
  ON loans FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update loans"
  ON loans FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_borrowers_status ON borrowers(status);
CREATE INDEX idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_payments_loan_id ON payments(loan_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);