import { useEffect, useState } from 'react';
import { getLoanStats } from '../services/loanService';
import { getTotalPayments, getRecentPayments } from '../services/paymentService';
import { Payment, Loan } from '../types';
import { DollarSign, TrendingUp, Users, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({
    activeLoanCount: 0,
    activeLoanAmount: 0,
    totalLoanCount: 0,
    completedLoanCount: 0,
  });
  const [totalPayments, setTotalPayments] = useState(0);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [statsData, paymentsTotal, recentPaymentsData] = await Promise.all([
        getLoanStats(),
        getTotalPayments(),
        getRecentPayments(30),
      ]);

      setStats(statsData);
      setTotalPayments(paymentsTotal);
      setRecentPayments(recentPaymentsData.slice(0, 5));
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Loans</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeLoanCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Amount: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(stats.activeLoanAmount)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Loans</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalLoanCount}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Loans</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedLoanCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(totalPayments)}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
        </div>
        <div className="divide-y">
          {recentPayments.length > 0 ? (
            recentPayments.map((payment) => (
              <div key={payment.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Payment ID: {payment.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-green-600">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(payment.amount)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-600">No recent payments</div>
          )}
        </div>
      </div>
    </div>
  );
}
