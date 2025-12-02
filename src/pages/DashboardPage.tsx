import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { authService, User } from '@/lib/auth';
import { loansAPI, referralsAPI, cardAPI, LoanStats, ReferralStats, VirtualCard, Loan } from '@/lib/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoansList from '@/components/dashboard/LoansList';
import VirtualCardView from '@/components/dashboard/VirtualCardView';
import ReferralProgram from '@/components/dashboard/ReferralProgram';
import LoanApplicationForm from '@/components/dashboard/LoanApplicationForm';

type TabType = 'overview' | 'loans' | 'card' | 'referrals';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  const [loanStats, setLoanStats] = useState<LoanStats | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showLoanForm, setShowLoanForm] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      const currentUser = authService.getUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const [statsRes, refRes, cardRes, loansRes] = await Promise.all([
          loansAPI.getStats(),
          referralsAPI.getStats(),
          cardAPI.getCard(),
          loansAPI.getAll(),
        ]);

        if (statsRes.success) setLoanStats(statsRes.stats);
        if (refRes.success) {
          setReferralStats(refRes.stats);
          setReferralCode(refRes.referral_code);
        }
        if (cardRes.success) setVirtualCard(cardRes.card);
        if (loansRes.success) setLoans(loansRes.loans);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleLoanCreated = async () => {
    setShowLoanForm(false);
    
    const [statsRes, loansRes] = await Promise.all([
      loansAPI.getStats(),
      loansAPI.getAll(),
    ]);

    if (statsRes.success) setLoanStats(statsRes.stats);
    if (loansRes.success) setLoans(loansRes.loans);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="border-b border-white/10">
            <div className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name="LayoutDashboard" size={18} className="inline mr-2" />
                Обзор
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'loans'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name="CreditCard" size={18} className="inline mr-2" />
                Мои займы
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'card'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name="Wallet" size={18} className="inline mr-2" />
                Карта
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'referrals'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name="Users" size={18} className="inline mr-2" />
                Реферальная программа
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Icon name="Loader2" size={48} className="text-primary animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60 text-sm">Активные займы</span>
                          <Icon name="TrendingUp" size={20} className="text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {loanStats?.active_loans || 0}
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          На сумму {loanStats?.active_amount.toLocaleString() || 0} ₽
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl p-6 border border-secondary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60 text-sm">Всего займов</span>
                          <Icon name="FileText" size={20} className="text-secondary" />
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {loanStats?.total_loans || 0}
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          Погашено {loanStats?.completed_loans || 0}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-6 border border-accent/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60 text-sm">Реферальные</span>
                          <Icon name="Gift" size={20} className="text-accent" />
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {referralStats?.total_referrals || 0}
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          Бонус {referralStats?.available_bonus.toLocaleString() || 0} ₽
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        onClick={() => setShowLoanForm(true)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        <Icon name="Plus" size={20} className="mr-2" />
                        Оформить новый займ
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'loans' && (
                  <LoansList
                    loans={loans}
                    onCreateNew={() => setShowLoanForm(true)}
                  />
                )}

                {activeTab === 'card' && virtualCard && (
                  <VirtualCardView card={virtualCard} />
                )}

                {activeTab === 'referrals' && (
                  <ReferralProgram
                    referralCode={referralCode}
                    stats={referralStats}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showLoanForm && (
        <LoanApplicationForm
          onClose={() => setShowLoanForm(false)}
          onSuccess={handleLoanCreated}
        />
      )}
    </div>
  );
}
