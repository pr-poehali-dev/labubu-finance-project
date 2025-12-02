import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ReferralStats } from '@/lib/api';

interface ReferralProgramProps {
  referralCode: string;
  stats: ReferralStats | null;
}

export default function ReferralProgram({ referralCode, stats }: ReferralProgramProps) {
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/login?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-8 border border-accent/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Реферальная программа</h2>
            <p className="text-white/60">
              Приглашайте друзей и получайте бонусы за каждого нового клиента
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-2xl flex items-center justify-center">
            <Icon name="Gift" size={32} className="text-white" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={20} className="text-accent" />
              <span className="text-white/60 text-sm">Рефералов</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.total_referrals || 0}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={20} className="text-accent" />
              <span className="text-white/60 text-sm">Всего заработано</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.total_bonus.toLocaleString() || 0} ₽
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Wallet" size={20} className="text-accent" />
              <span className="text-white/60 text-sm">Доступно</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.available_bonus.toLocaleString() || 0} ₽
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Ваша реферальная ссылка</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Реферальный код
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={referralCode}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-mono"
              />
              <Button
                onClick={() => copyToClipboard(referralCode)}
                className="bg-primary hover:bg-primary/80"
              >
                <Icon name={copied ? 'Check' : 'Copy'} size={18} />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Реферальная ссылка
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm"
              />
              <Button
                onClick={() => copyToClipboard(referralLink)}
                className="bg-primary hover:bg-primary/80"
              >
                <Icon name={copied ? 'Check' : 'Copy'} size={18} />
              </Button>
            </div>
          </div>
        </div>

        {copied && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-2">
            <Icon name="Check" size={18} className="text-green-400" />
            <span className="text-green-300 text-sm">Скопировано в буфер обмена!</span>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Как это работает?</h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Поделитесь ссылкой</h4>
              <p className="text-white/60 text-sm">
                Отправьте реферальную ссылку друзьям или разместите её в соцсетях
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Друг регистрируется</h4>
              <p className="text-white/60 text-sm">
                Когда кто-то регистрируется по вашей ссылке, он становится вашим рефералом
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Получайте бонусы</h4>
              <p className="text-white/60 text-sm">
                За каждый оформленный займ ваших рефералов вы получаете бонус на виртуальную карту
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
