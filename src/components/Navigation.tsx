import { AlertCircle, LogOut, Users, DollarSign, BarChart3 } from 'lucide-react';
import { signOut } from '../services/authService';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function Navigation({ activeTab, onTabChange, onLogout }: NavigationProps) {
  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Loan Manager
            </h1>

            <div className="hidden md:flex gap-1">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => onTabChange('borrowers')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === 'borrowers'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Borrowers
              </button>
              <button
                onClick={() => onTabChange('loans')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === 'loans'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Loans
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('borrowers')}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              activeTab === 'borrowers'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Borrowers
          </button>
          <button
            onClick={() => onTabChange('loans')}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
              activeTab === 'loans'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Loans
          </button>
        </div>
      </div>
    </nav>
  );
}
