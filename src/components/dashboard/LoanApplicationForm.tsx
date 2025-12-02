import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { loansAPI } from '@/lib/api';

interface LoanApplicationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoanApplicationForm({ onClose, onSuccess }: LoanApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    term_days: '30',
    purpose: '',
  });

  const calculateInterest = () => {
    const amount = parseFloat(formData.amount) || 0;
    const days = parseInt(formData.term_days) || 30;
    const dailyRate = 0.003;
    const interest = amount * dailyRate * days;
    const total = amount + interest;

    return { interest, total };
  };

  const { interest, total } = calculateInterest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.amount);
    const termDays = parseInt(formData.term_days);

    if (amount < 1000 || amount > 100000) {
      setError('Сумма должна быть от 1,000 до 100,000 ₽');
      return;
    }

    if (termDays < 7 || termDays > 365) {
      setError('Срок должен быть от 7 до 365 дней');
      return;
    }

    setLoading(true);

    try {
      const result = await loansAPI.create(amount, termDays, formData.purpose);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Ошибка создания заявки');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-white/10 rounded-3xl p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <Icon name="X" size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-4">
            <Icon name="FileText" size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Заявка на займ</h2>
          <p className="text-white/60">Заполните данные для оформления займа</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Сумма займа (₽)
            </label>
            <input
              type="number"
              required
              min="1000"
              max="100000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary"
              placeholder="10000"
            />
            <p className="text-white/40 text-xs mt-1">От 1,000 до 100,000 ₽</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Срок (дней)</label>
            <select
              value={formData.term_days}
              onChange={(e) => setFormData({ ...formData, term_days: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary"
            >
              <option value="7">7 дней</option>
              <option value="14">14 дней</option>
              <option value="21">21 день</option>
              <option value="30">30 дней</option>
              <option value="60">60 дней</option>
              <option value="90">90 дней</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Цель займа (необязательно)
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="Опишите для чего вам нужен займ"
            />
          </div>

          {formData.amount && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3">Расчёт займа:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Сумма займа:</span>
                  <span className="text-white font-medium">
                    {parseFloat(formData.amount).toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Проценты (0.3% в день):</span>
                  <span className="text-white font-medium">{interest.toLocaleString()} ₽</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                  <span className="text-white font-semibold">К возврату:</span>
                  <span className="text-white font-bold text-lg">
                    {total.toLocaleString()} ₽
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить заявку
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
