import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/auth';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Л</span>
            </div>
            <div>
              <div className="text-white font-bold">Лабубу Финанс</div>
              <div className="text-white/60 text-xs">Личный кабинет</div>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-medium">{user.name}</div>
              <div className="text-white/60 text-sm">{user.email}</div>
            </div>

            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
