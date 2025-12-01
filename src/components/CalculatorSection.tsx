import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CalculatorSectionProps {
  onNavigate: (section: string) => void;
}

export default function CalculatorSection({ onNavigate }: CalculatorSectionProps) {
  const [amount, setAmount] = useState(30000);
  const [days, setDays] = useState(14);

  const dailyRate = 0.003;
  const interest = Math.round(amount * dailyRate * days);
  const total = amount + interest;

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Калькулятор займа
            </span>
          </h2>
          <p className="text-xl text-foreground/70">
            Рассчитайте условия вашего займа за несколько секунд
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-2xl flex items-center">
                <Icon name="Calculator" size={28} className="mr-3 text-primary" />
                Параметры займа
              </CardTitle>
              <CardDescription>Настройте сумму и срок под ваши потребности</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Сумма займа</label>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {amount.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <Slider
                    value={[amount]}
                    onValueChange={(value) => setAmount(value[0])}
                    min={5000}
                    max={100000}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-foreground/60">
                    <span>5 000 ₽</span>
                    <span>100 000 ₽</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Срок займа</label>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                    </div>
                  </div>
                  <Slider
                    value={[days]}
                    onValueChange={(value) => setDays(value[0])}
                    min={7}
                    max={30}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-foreground/60">
                    <span>7 дней</span>
                    <span>30 дней</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-primary/20">
                  <span className="text-lg text-foreground/70">Сумма займа:</span>
                  <span className="text-2xl font-semibold">{amount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-primary/20">
                  <span className="text-lg text-foreground/70">Проценты (0.3% в день):</span>
                  <span className="text-2xl font-semibold">{interest.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-medium">К возврату:</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={() => onNavigate('account')}
                >
                  <Icon name="ArrowRight" size={24} className="mr-2" />
                  Оформить займ
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg py-6 border-2"
                  onClick={() => onNavigate('terms')}
                >
                  <Icon name="Info" size={24} className="mr-2" />
                  Подробные условия
                </Button>
              </div>

              <div className="bg-accent/10 rounded-xl p-4 flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-1" />
                <p className="text-sm text-foreground/70">
                  Расчет носит информационный характер. Итоговая сумма может измениться после рассмотрения заявки.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
