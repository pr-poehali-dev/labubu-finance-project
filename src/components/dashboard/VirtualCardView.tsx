import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { VirtualCard, CardTransaction, cardAPI } from '@/lib/api';

interface VirtualCardViewProps {
  card: VirtualCard;
}

export default function VirtualCardView({ card }: VirtualCardViewProps) {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [transferData, setTransferData] = useState({
    phone: '',
    amount: '',
    comment: '',
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const result = await cardAPI.getTransactions();
      if (result.success) {
        setTransactions(result.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await cardAPI.createSBPTransfer(
        transferData.phone,
        parseFloat(transferData.amount),
        transferData.comment
      );

      if (result.success) {
        setShowTransferForm(false);
        setTransferData({ phone: '', amount: '', comment: '' });
        loadTransactions();
      } else {
        alert(result.error || 'Ошибка перевода');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="text-lg font-semibold">Лабубу Финанс</div>
            <Icon name="Wallet" size={32} />
          </div>

          <div className="mb-6">
            <div className="text-sm opacity-80 mb-2">Номер карты</div>
            <div className="text-2xl font-mono tracking-wider">{card.card_number_masked}</div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80 mb-1">Баланс</div>
              <div className="text-3xl font-bold">{card.balance.toLocaleString()} ₽</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">Статус</div>
              <div className="text-lg font-semibold capitalize">{card.status}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={() => setShowTransferForm(!showTransferForm)}
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Icon name="Send" size={18} className="mr-2" />
          Перевод по СБП
        </Button>
      </div>

      {showTransferForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Перевод по СБП</h3>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Номер телефона
              </label>
              <input
                type="tel"
                required
                value={transferData.phone}
                onChange={(e) => setTransferData({ ...transferData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Сумма</label>
              <input
                type="number"
                required
                min="1"
                max={card.balance}
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Комментарий (необязательно)
              </label>
              <input
                type="text"
                value={transferData.comment}
                onChange={(e) => setTransferData({ ...transferData, comment: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="За что перевод"
              />
            </div>

            <div className="flex space-x-3">
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
                    Отправить
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowTransferForm(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Отмена
              </Button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-white mb-4">История операций</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <Icon name="History" size={48} className="text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Операций пока нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon
                      name={transaction.type === 'sbp_transfer' ? 'ArrowUpRight' : 'ArrowDownLeft'}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {transaction.type === 'sbp_transfer' ? 'Перевод по СБП' : 'Пополнение'}
                    </p>
                    {transaction.phone && (
                      <p className="text-white/60 text-sm">{transaction.phone}</p>
                    )}
                    {transaction.comment && (
                      <p className="text-white/60 text-sm">{transaction.comment}</p>
                    )}
                    <p className="text-white/40 text-xs">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold ${
                    transaction.type === 'sbp_transfer' ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {transaction.type === 'sbp_transfer' ? '-' : '+'}
                  {transaction.amount.toLocaleString()} ₽
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
