import { useEffect, useState } from 'react';
import { getAllLoans, createLoan, updateLoan } from '../services/loanService';
import { getBorrowers } from '../services/borrowerService';
import { getPaymentsByLoan, createPayment } from '../services/paymentService';
import { Loan, Borrower, Payment } from '../types';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

export function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [payments, setPayments] = useState<{ [key: string]: Payment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    borrower_id: '',
    principal_amount: '',
    interest_rate: '',
    loan_term_months: '',
    start_date: '',
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    principal_amount: '',
    interest_amount: '',
    payment_date: '',
    payment_method: 'cash',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [loansData, borrowersData] = await Promise.all([getAllLoans(), getBorrowers()]);
      setLoans(loansData);
      setBorrowers(borrowersData);

      const paymentsMap: { [key: string]: Payment[] } = {};
      for (const loan of loansData) {
        paymentsMap[loan.id] = await getPaymentsByLoan(loan.id);
      }
      setPayments(paymentsMap);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const endDate = new Date(formData.start_date);
      endDate.setMonth(endDate.getMonth() + parseInt(formData.loan_term_months));

      await createLoan({
        borrower_id: formData.borrower_id,
        principal_amount: parseFloat(formData.principal_amount),
        interest_rate: parseFloat(formData.interest_rate),
        loan_term_months: parseInt(formData.loan_term_months),
        start_date: formData.start_date,
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
      });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to create loan');
    }
  }

  async function handlePaymentSubmit(e: React.FormEvent, loanId: string) {
    e.preventDefault();
    try {
      await createPayment({
        loan_id: loanId,
        payment_date: paymentData.payment_date,
        amount: parseFloat(paymentData.amount),
        principal_amount: parseFloat(paymentData.principal_amount),
        interest_amount: parseFloat(paymentData.interest_amount),
        payment_method: paymentData.payment_method,
      });
      await loadData();
      setPaymentData({
        amount: '',
        principal_amount: '',
        interest_amount: '',
        payment_date: '',
        payment_method: 'cash',
      });
      setShowPaymentForm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    }
  }

  function resetForm() {
    setFormData({
      borrower_id: '',
      principal_amount: '',
      interest_rate: '',
      loan_term_months: '',
      start_date: '',
    });
    setShowForm(false);
  }

  function getBorrowerName(borrowerId: string) {
    return borrowers.find((b) => b.id === borrowerId)?.full_name || 'Unknown';
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading loans...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Loans</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Loan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Create New Loan</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.borrower_id}
                onChange={(e) => setFormData({ ...formData, borrower_id: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Borrower</option>
                {borrowers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.full_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Principal Amount"
                step="0.01"
                value={formData.principal_amount}
                onChange={(e) => setFormData({ ...formData, principal_amount: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                step="0.01"
                value={formData.interest_rate}
                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Loan Term (months)"
                value={formData.loan_term_months}
                onChange={(e) => setFormData({ ...formData, loan_term_months: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Create Loan
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loans.map((loan) => (
          <div key={loan.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getBorrowerName(loan.borrower_id)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        loan.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : loan.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">Principal</p>
                      <p className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(loan.principal_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{loan.interest_rate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Term</p>
                      <p className="font-semibold text-gray-900">{loan.loan_term_months} months</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Started</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(loan.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setExpandedLoan(expandedLoan === loan.id ? null : loan.id)
                  }
                  className="text-gray-400 hover:text-gray-600 ml-4"
                >
                  {expandedLoan === loan.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedLoan === loan.id && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">Payments</h4>
                    {loan.status === 'active' && (
                      <button
                        onClick={() =>
                          setShowPaymentForm(
                            showPaymentForm === loan.id ? null : loan.id
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                      >
                        Record Payment
                      </button>
                    )}
                  </div>

                  {showPaymentForm === loan.id && (
                    <form
                      onSubmit={(e) => handlePaymentSubmit(e, loan.id)}
                      className="bg-green-50 p-4 rounded-lg mb-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={paymentData.payment_date}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              payment_date: e.target.value,
                            })
                          }
                          required
                          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Total Amount"
                          step="0.01"
                          value={paymentData.amount}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              amount: e.target.value,
                            })
                          }
                          required
                          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Principal Amount"
                          step="0.01"
                          value={paymentData.principal_amount}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              principal_amount: e.target.value,
                            })
                          }
                          required
                          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Interest Amount"
                          step="0.01"
                          value={paymentData.interest_amount}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              interest_amount: e.target.value,
                            })
                          }
                          required
                          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition"
                        >
                          Record
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(null)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {(payments[loan.id] || []).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            Principal: {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(payment.principal_amount)}{' '}
                            | Interest:{' '}
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(payment.interest_amount)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(payment.amount)}
                        </p>
                      </div>
                    ))}
                    {(!payments[loan.id] || payments[loan.id].length === 0) && (
                      <p className="text-sm text-gray-600 text-center py-2">
                        No payments recorded
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {loans.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
          No loans yet. Create one to get started!
        </div>
      )}
    </div>
  );
}
