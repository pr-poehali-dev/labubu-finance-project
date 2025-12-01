import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-gradient bg-[length:400%_400%]" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-accent/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent/30 animate-scale-in">
            <Icon name="Clock" size={20} className="text-accent" />
            <span className="text-sm font-medium text-accent">Скоро запуск • Ожидайте открытия</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Займы онлайн
            </span>
            <br />
            <span className="text-foreground">без лишних вопросов</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto">
            От 5 000 до 100 000 рублей на карту за несколько минут. 
            Минимум документов, максимум возможностей.
          </p>

          <div className="bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border-2 border-accent/30">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Icon name="Info" size={24} className="text-accent" />
              <h3 className="text-xl font-bold text-foreground">Компания ожидает запуска</h3>
            </div>
            <p className="text-foreground/70">
              Мы готовимся к открытию и пока не выдаем займы. Следите за обновлениями!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-xl"
              onClick={() => onNavigate('calculator')}
            >
              <Icon name="Calculator" size={24} className="mr-2" />
              Рассчитать займ
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2"
              onClick={() => onNavigate('terms')}
            >
              <Icon name="FileText" size={24} className="mr-2" />
              Узнать условия
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
            {[
              { icon: 'Zap', label: 'За 5 минут', desc: 'одобрение' },
              { icon: 'Shield', label: '0.3% в день', desc: 'ставка' },
              { icon: 'Users', label: '18-45 лет', desc: 'возраст' },
              { icon: 'CreditCard', label: 'На карту', desc: 'выдача' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name={item.icon as any} size={24} className="text-white" />
                </div>
                <div className="text-lg font-bold text-foreground">{item.label}</div>
                <div className="text-sm text-foreground/60">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}