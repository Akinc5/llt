import { useEffect, useState } from 'react';
import { onAuthStateChange } from './services/authService';
import { Auth } from './components/Auth';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Borrowers } from './components/Borrowers';
import { Loans } from './components/Loans';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      unsubscribe.data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth onSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => setSession(null)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'borrowers' && <Borrowers />}
        {activeTab === 'loans' && <Loans />}
      </main>
    </div>
  );
}

export default App;
