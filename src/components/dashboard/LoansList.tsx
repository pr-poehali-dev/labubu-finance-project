import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Loan } from '@/lib/api';

interface LoansListProps {
  loans: Loan[];
  onCreateNew: () => void;
}

export default function LoansList({ loans, onCreateNew }: LoansListProps) {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: 'На рассмотрении', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
      approved: { label: 'Одобрен', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      active: { label: 'Активный', className: 'bg-green-500/20 text-green-300 border-green-500/30' },
      repaid: { label: 'Погашен', className: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
      rejected: { label: 'Отклонен', className: 'bg-red-500/20 text-red-300 border-red-500/30' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl mb-4">
          <Icon name="FileText" size={40} className="text-white/40" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">У вас пока нет займов</h3>
        <p className="text-white/60 mb-6">Оформите свой первый займ прямо сейчас</p>
        <Button
          onClick={onCreateNew}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Icon name="Plus" size={20} className="mr-2" />
          Оформить займ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Мои займы</h2>
        <Button
          onClick={onCreateNew}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Новый займ
        </Button>
      </div>

      {loans.map((loan) => (
        <div
          key={loan.id}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="DollarSign" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {loan.amount.toLocaleString()} ₽
                </h3>
                <p className="text-white/60 text-sm">Займ #{loan.id}</p>
              </div>
            </div>
            {getStatusBadge(loan.status)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/60">Срок:</span>
              <p className="text-white font-medium">{loan.term_days} дней</p>
            </div>
            <div>
              <span className="text-white/60">К возврату:</span>
              <p className="text-white font-medium">{loan.total_repayment.toLocaleString()} ₽</p>
            </div>
            <div>
              <span className="text-white/60">Оплачено:</span>
              <p className="text-white font-medium">{loan.paid_amount.toLocaleString()} ₽</p>
            </div>
            <div>
              <span className="text-white/60">Дата создания:</span>
              <p className="text-white font-medium">{formatDate(loan.created_at)}</p>
            </div>
          </div>

          {loan.purpose && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-white/60 text-sm">Цель: </span>
              <span className="text-white text-sm">{loan.purpose}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
