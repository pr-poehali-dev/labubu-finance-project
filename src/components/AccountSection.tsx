import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function AccountSection() {
  const [step, setStep] = useState<'phone' | 'code' | 'registered'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    if (phone.length === 11) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('code');
      }, 1500);
    }
  };

  const handleVerifyCode = () => {
    if (code.length === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('registered');
      }, 1500);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted/30 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Личный кабинет
            </span>
          </h2>
          <p className="text-xl text-foreground/70 mb-6">
            Войдите или зарегистрируйтесь для оформления займа
          </p>
          
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-accent/30 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Icon name="AlertCircle" size={24} className="text-accent" />
              <h3 className="text-xl font-bold text-foreground">Регистрация временно недоступна</h3>
            </div>
            <p className="text-foreground/70">
              Компания готовится к запуску. Оформление и выдача займов начнутся в ближайшее время.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {step === 'phone' && (
            <Card className="border-2 border-primary/20 shadow-2xl animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-2xl flex items-center">
                  <Icon name="Smartphone" size={28} className="mr-3 text-primary" />
                  Вход по номеру телефона
                </CardTitle>
                <CardDescription>Мы отправим SMS с кодом подтверждения</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={11}
                    className="text-lg h-12"
                  />
                  <p className="text-sm text-foreground/60">
                    Введите номер в формате: 8XXXXXXXXXX или 7XXXXXXXXXX
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={handleSendCode}
                  disabled={true}
                >
                  <>
                    <Icon name="Lock" size={24} className="mr-2" />
                    Регистрация недоступна
                  </>
                </Button>

                <div className="bg-primary/10 rounded-xl p-4 flex items-start space-x-3">
                  <Icon name="Shield" size={20} className="text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm text-foreground/70">
                    Ваши данные защищены и не передаются третьим лицам
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'code' && (
            <Card className="border-2 border-primary/20 shadow-2xl animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-2xl flex items-center">
                  <Icon name="MessageSquare" size={28} className="mr-3 text-primary" />
                  Введите код из SMS
                </CardTitle>
                <CardDescription>
                  Код отправлен на номер +{phone.slice(0, 1)} ({phone.slice(1, 4)}) ***-**-{phone.slice(-2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Код подтверждения</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} value={code} onChange={setCode}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-16 h-16 text-2xl" />
                        <InputOTPSlot index={1} className="w-16 h-16 text-2xl" />
                        <InputOTPSlot index={2} className="w-16 h-16 text-2xl" />
                        <InputOTPSlot index={3} className="w-16 h-16 text-2xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={handleVerifyCode}
                  disabled={code.length !== 4 || loading}
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={24} className="mr-2 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={24} className="mr-2" />
                      Подтвердить
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('phone')}
                >
                  <Icon name="ArrowLeft" size={20} className="mr-2" />
                  Изменить номер
                </Button>

                <button className="w-full text-sm text-primary hover:underline">
                  Отправить код повторно
                </button>
              </CardContent>
            </Card>
          )}

          {step === 'registered' && (
            <Card className="border-2 border-primary/20 shadow-2xl animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle2" size={40} className="text-white" />
                </div>
                <CardTitle className="text-2xl">Добро пожаловать!</CardTitle>
                <CardDescription>Вы успешно вошли в личный кабинет</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Номер телефона:</span>
                    <span className="font-medium">+{phone.slice(0, 1)} ({phone.slice(1, 4)}) ***-**-{phone.slice(-2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Статус:</span>
                    <span className="font-medium text-primary">Новый клиент</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Доступный лимит:</span>
                    <span className="font-bold text-xl text-primary">30 000 ₽</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <Icon name="Plus" size={24} className="mr-2" />
                    Оформить первый займ
                  </Button>
                  <Button size="lg" variant="outline" className="w-full text-lg py-6 border-2">
                    <Icon name="FileText" size={24} className="mr-2" />
                    Мои заявки
                  </Button>
                  <Button size="lg" variant="outline" className="w-full text-lg py-6 border-2">
                    <Icon name="User" size={24} className="mr-2" />
                    Профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}